/**
 * ドロップされた画像の処理：暫定
 * (参考1) http://proto.sabi-an.com/18/
 */

(function(){
	//ドロップ領域のdiv要素
	var dp = null;
	//ファイルロード進捗表示領域のdiv要素
	var prog = null;
	//ファイル情報表示領域のdiv要素
	var info = null;
	// ファイルの内容表示領域のdiv要素
	var cont = null;
	// FileReaderインターフェースオブジェクト
	var reader = null;
	// ドロップ画像の表示領域要素
	var targetImgs = null;
	
	// ページがロードされたときの処理
	window.addEventListener("load", function(){
		//ドロップ領域のdiv要素
		dp = document.getElementById("dp");
		//ファイルロード進捗表示領域のdiv要素
		prog = document.getElementById("prog");
		//ファイル情報表示領域のdiv要素
		info = document.getElementById("info");
		//ファイルの内容表示領域のdiv要素
		cont = document.getElementById("cont");
		//読み取り中止ボタンのbutton要素
		abrt = document.getElementById("abrt");
		//ドロップ画像の表示領域要素
		targetImgs = document.getElementById("targetImgs");
		//アップロード開始ボタンのbutton要素
		startUpld = document.getElementById("startUpload");
//		console.log("console.log" + startUpload);
		
		//dragoverイベントのイベントリスナーをセット
		dp.addEventListener("dragover", function(evt){
			evt.preventDefault();
		}, false);
		
		//dropイベントのイベントリスナーをセット
		dp.addEventListener("drop", function(evt){
			evt.preventDefault();
			//file_droped(evt);
			fileRead(evt);
		}, false);
		
		//アップロード開始ボタンにはclickイベントのイベントリスナーをセット
		startUpld.addEventListener("click", startUpload, false);
		
		//中止ボタンにはclickイベントのイベントリスナーをセット
		abrt.addEventListener("click", abort, false);
	}, false);
	
	
	
	/*
	// ファイルがドロップされた時の処理
	function file_droped(evt){
		// 表示領域をクリア
		info.innerHTML = "";
		prog.innerHTML = "";
		cont.innerHTML = "";
		//ドロップされたファイルのFileインターフェースオブジェクト
		var fileList = evt.dataTransfer.files;
		if(!fileList){
			info.innerHTML = "<p>ファイルをドロップしてください</p>";
			return;
		}
		
		
		//ファイルロードの進捗表示
		reader.onprogress = function(evt){
			if(evt.lengthComputable == true && evt.total > 0){
				var rate = (evt.load * 100 / evt.total).toFixed(1);
				var msg = "";
				msg += evt.total + "バイト中、";
				msg += evt.loaded + "バイトをロードしました。";
				msg += "(" + rate + "%)";
				prog.innerHTML = msg;
			}
		};
		
		
		//プロパティ表示
		var msg = "";
		
		for(var i = 0; i < fileList.length; i++){
			
			var file = fileList[i];
			
			//FileReaderインターフェースオブジェクト
			reader = new FileReader();
		
			msg += "size: " + fileList[i].size + "<br>";
			msg += "name: " + fileList[i].name + "<br>";
			msg += "type: " + fileList[i].type + "<br>";
			info.innerHTML = msg;
		
			//画像ファイル(SVGも含む)の場合
			if( /^image/.test(file.type)){
				
				reader.readAsDataURL(file);
				console.log(file);
				
				reader.onload = ( function(theFile){
						return function(evt){
						var el = document.createElement("object");	
						el.setAttribute("type", theFile.type);	
						el.setAttribute("data", evt.target.result);
						cont.appendChild(el);				// なぜか効果がなくなったコード
						el.setAttribute("height", "150"); // サムネイル表示する画像の高さを150に固定
						targetImgs.appendChild(el);
						el.setAttribute("height", "150");
						};
				});

			}
		
		
		
			// ビデオファイルの場合
			else if(/^video/.test(file.type)){
				var el = docutment.createElement("video");
				if( !/^(maybe|probably)/.test( el.canPlayType(fileList[i].type))){
					return;
				}
				reader.readAsDataURL(file);
				reader.onload = function(evt){
					el.setAttribute("type", file.type);
					el.setAttribute("src", reader.result);
					el.setAttirbute("controls", true);
					cont.appendChild(el);
				};
			}
			
			// テキストファイルの場合
			else if (/^text/.test(file.type)){
				reader.readAsText(file);
				reader.onload = function(evt){
					cont.appendChild( document.createTextNode(reader.resutl));
				};
			}
			
			// 上記以外ならば、先頭の40バイト分を16進数表示
			else{
				reader.readAsBinaryString(file);
				reader.onload = function(evt){
					var str = "";
					for (var i=0; i< 80; i++){
						var hex = reader.result.charCodeAt(i).toString(16);
						if(hex.length < 2){
							hex = "0" + hex;
						}
						str += hex;
						if((i+1) % 16 == 0){
							str += "<br>";
						} else {
							str += " ";
						}
					}
					cont.appendChild(document.createTextNode(str));
				};
			}
		}
	
	}
	*/
	
	//ファイルのロードを中止
	function abort(){
		alert("ボタンがクリックされました");
		if(reader == null){
			result;
		}
		reader.abort();
	}

	//アップロードの開始
	function startUpload(){
		sendData();
	}
	
	// リクエストのボディを格納する文字列
	var data = "";
	
	  // リクエストの各パートを定義するためのセパレータ
	  var boundary = "blob";
	
	// ドロップ時のアクション
	function fileRead(event)
	{
	  preventDefault(event);

	  var files = event.dataTransfer.files;
	  var objDispArea = document.getElementById("disp_area");

	  objDispArea.innerHTML = '';




	  
	  // ドロップされたファイルの処理
	  for ( var i = 0; i < files.length; i++ ) {

	    var f = files[i];

	    // リクエストのボディに新たなパートを作成する
	    data += "--" + boundary +"¥r¥n";
	    // フォームデータであることを示すヘッダ
	    data += "content-disposition: form-data; ";
	    // フォームデータの名前を定義   <-- いったい何に使われる名前だ？
	    data += 'name="' + f.name + '"; ';
	    // 実際のファイル名を入力
	    data += 'filename="' + f.name + '"¥r¥n;';
	    // ファイルのMIMEタイプを入力
	    data += 'Content-Type="' + f.type + '"¥r¥n;';
	    // メタデータとデータの間に空行を入れる
	    data += "¥r¥n";
	    

	    if ( !f.type.match('image.*') && !f.type.match('text.*') ) {
	      objDispArea.innerHTML = '【' + f.name + '】 画像かテキストファイルでお試しください。';
	      return;
	    }

	    var objFileReader = new FileReader();
	    objFileReader.onerror = function(evt) {
	      objDispArea.innerHTML = '【' + f.name + '】 ファイル読み込み時にエラーが発生しました。';
	      return;
	    }

	    // 画像の処理
	    if ( f.type.match('image.*') ) {
	      objFileReader.onload = ( function(theFile) {
	        return function(e) {
	          var span = document.createElement('span');
	          span.innerHTML = ['<img class="thumb" id="thumb" src="', e.target.result, '" title="', escape(theFile.name), '">'].join('');
	          document.getElementById('disp_area').insertBefore(span, null);
	          
	          // マルチパートのデータ部分に画像データをバイナリで読み込む
	          var objImgDataReader = new FileReader();
	          
	          objImgDataReader.readAsBinaryString(theFile);
	          objImgDataReader.onload = (function(){
	        	  data += objImgDataReader.result;
	          });
	          
	        };
	      } )(f);
	      objFileReader.readAsDataURL(f);
	    }

	    // テキストの処理
	    if ( f.type.match('text.*') ) {
	      objFileReader.onload = function(evt) {
	        objDispArea.innerHTML = objFileReader.result;
	      }
	      objFileReader.readAsText(f);
	    }

	  }
	  
	  // リクエストのボディを閉じる
	  data += "--" + boundary + "--";
	  
	  
	  
	}
	
	// ブラウザが実装している処理を止める
	function preventDefault(event)
	{
	  event.preventDefault();
	}
	
	function sendData()
	{
		alert("ボタンがクリックされました");
		
		// マルチパートのフォームデータリクエストを構築するため、
		// XMLHttpRequest のインスタンスを生成
		var XHR = new XMLHttpRequest();
		
		// データが正常に送信された場合に行うことを定義
		XHR.addEventListener("load", function(event){
			alert("Data sent and response loaded.");
		});
		
		// エラーが発生した場合に行うことを定義
		XHR.addEventListener("error", function(event){
			alert("Something goes wrong.");
		});
		
		// リクエストをセットアップする
		XHR.open("post", "http://localhost:8080/pluginLessProj/acceptImgs.acceptImgs");
		
		// マルチパートのフォームデータのPOSTリクエストを扱う為に、必要なHTTPヘッダを追加
		XHR.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
		XHR.setRequestHeader("Content-Length", data.length);
		
		// 最後にデータを送信する
		// Firefox のバグに416178により、send()の代わりにsendAsBinary()を使用すること
		XHR.sendAsBinary(data);
	}
	
})();

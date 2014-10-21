/**
 * ドロップされた画像の処理：暫定
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
		
		//dragoverイベントのイベントリスナーをセット
		dp.addEventListener("dragover", function(evt){
			evt.preventDefault();
		}, false);
		
		//dropイベントのイベントリスナーをセット
		dp.addEventListener("drop", function(evt){
			evt.preventDefault();
			file_droped(evt);
		}, false);
		
		//中止ボタンにはclickイベントのイベントリスナーをセット
		abrt.addEventListener("click", abort, false);
	}, false);
	
	
	
	
	// ファイルがドロップされた時の処理
	function file_droped(evt){
		// 表示領域をクリア
		info.innerHTML = "";
		prog.innerHTML = "";
		cont.innerHTML = "";
		//ドロップされたファイルのFileインターフェースオブジェクト
		var file = evt.dataTransfer.files[0];
		if(!file){
			info.innerHTML = "<p>ファイルをドロップしてください</p>";
			return;
		}
		//FileReaderインターフェースオブジェクト
		reader = new FileReader();
		
		
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
		msg += "size: " + file.size + "<br>";
		msg += "name: " + file.name + "<br>";
		msg += "type: " + file.type + "<br>";
		info.innerHTML = msg;
		
		//画像ファイル(SVGも含む)の場合
		if( /^image/.test(file.type)){
			reader.readAsDataURL(file);
			reader.onload = function(evt){
				var el = document.createElement("object");
				el.setAttribute("type", file.type);
				el.setAttribute("data", reader.result);
				cont.appendChild(el);
			};
		}
		
		
		
		// ビデオファイルの場合
		else if(/^video/.test(file.type)){
			var el = docutment.createElement("video");
			if( !/^(maybe|probably)/.test( el.canPlayType(file.type))){
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
	
	
	
	//ファイルのロードを中止
	function abort(){
		if(reader == null){
			result;
		}
		reader.abort();
	}

})();

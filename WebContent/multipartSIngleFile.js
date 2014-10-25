// ファイル選択ダイアログを表示するリンク
var fileSelect = null;
// ファイル選択ダイアログを表示するinputフォーム（不可視設定)
var fileElem   = null;
// 指定されたファイルを列挙するエリア
var fileList   = null;
// アップロードの全体進捗を表すプログレスバーの領域
var uploadProgressTotal = null;
// アップロードの進捗を表すプログレスバーの領域(1ファイルあたり)
var uploadProgressFile = null;
	
// ページがロードされたときの処理
window.addEventListener("load", function(){
	
	//アップロード開始ボタンのbutton要素
	startUpld = document.getElementById("startUpload");
	//アップロード開始ボタンにはclickイベントのイベントリスナーをセット
	startUpld.addEventListener("click", sendFiles, false);
	
	fileSelect = document.getElementById("fileSelect");
	fileElem   = document.getElementById("fileElem");
	fileList   = document.getElementById("fileList");
	
	uploadProgressTotal = document.getElementById("uploadProgressTotal");
	uploadProgressFile = document.getElementById("uploadProgressFile");
	
	// リンクがクリックされると、inputフォームがクリックされたことにする
	fileSelect.addEventListener("click", function (e) {
		if (fileElem) {
			fileElem.click();
		}
		e.preventDefault(); // "#" に移動するのを防ぐ
	}, false);

	// 画像をドロップする領域にたいして、イベントリスナを登録する
	fileList.addEventListener("dragenter", dragenter, false);
	fileList.addEventListener("dragover", dragover, false);
	fileList.addEventListener("drop", drop, false);
	
	// ドラッグエンターを無視
	function dragenter(e) {
		e.stopPropagation();
		e.preventDefault();
	}

	// ドラッグオーバーを無視
	function dragover(e) {
		e.stopPropagation();
		e.preventDefault();
	}

	// ドロップに対して独数関数を実行
	function drop(e) {
		e.stopPropagation();
		e.preventDefault();

		var dt = e.dataTransfer;
		var files = dt.files;

		handleFiles(files);
	}
	
}, false);






function FileUpload(img, file) {
	var reader = new FileReader();  
	var xhr = new XMLHttpRequest();
	this.xhr = xhr;
	// ファイルのアップロード前のプログレスーバの初期化
	uploadProgressFile.value = 0;
		  
	var self = this;
	this.xhr.upload.addEventListener("progress", function(e) {
		// 全体の長さがわかっている判定する。わかっていなかったらどうするか？
		if (e.lengthComputable) {
			// コンソールログに出力。送信済みサイズと、全サイズ（どちらも、１ファイルあたり）
			console.log(e.loaded,e.total);
			// 1ファイルのアップロード進捗を表現
			uploadProgressFile.value = e.loaded / e.total * 100;
		}
	}, false);
		  


	// データが正常に送信された場合に行うことを定義
	xhr.addEventListener("load", function(event){
		console.log("Data sent and response loaded.");
//				alert("Data sent and response loaded.");
	});
			
	// エラーが発生した場合に行うことを定義
	xhr.addEventListener("error", function(event){
		alert("Something goes wrong.");
	});

	// リクエストをセットアップする
	xhr.open("POST", "http://localhost:8080/pluginLessProj/acceptImgs.acceptImgs");
	xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');

	reader.onload = function(evt) {
		
		// リクエストの各パートを定義するためのセパレータ
		var boundary = "blob";
		
		//--- 以下がアルバム情報
		
		// リクエストのボディに新たなパートを作成する
		var data = "--" + boundary +"\r\n";
		// フォームデータであることを示すヘッダ
		data += "content-disposition: form-data; ";
		// フォームデータの名前を定義   <-- いったい何に使われる名前だ？
		data += 'name="upload.info"; ';
		// 実際のファイル名を入力
		data += 'filename="uploadinfo.xml"\r\n';
		// ファイルのMIMEタイプを入力
		data += 'Content-Type:text/plain\r\n';
		// メタデータとデータの間に空行を入れる
		data += '\r\n';
		          
		// アップロード情報の中身を追加
		data += '<uploadinf id="miyazaki" ps="miyazaki" albumId="0000" uploadId="9999" />' + "\r\n"
				
		//--- 以上が、アルバム情報。以下は、画像データ
				
		// リクエストのボディに新たなパートを作成する
		data += "--" + boundary +"\r\n";
		// フォームデータであることを示すヘッダ
		data += "content-disposition: form-data; ";
		// フォームデータの名前を定義   <-- いったい何に使われる名前だ？
		data += 'name="' + file.name + '"; ';
		// 実際のファイル名を入力
		data += 'filename="' + file.name + '"\r\n';
		// ファイルのMIMEタイプを入力
		data += 'Content-Type:' + file.type + '\r\n';
		// メタデータとデータの間に空行を入れる
		data += '\r\n';
	          
		// マルチパートのデータ部分に画像データをバイナリで読み込む
		// リクエストのボディにバイナリデータを入れ
		data += evt.target.result + '\r\n';
			  
		// リクエストのボディを閉じる
		data += "--" + boundary + "--";

			
		// マルチパートのフォームデータのPOSTリクエストを扱う為に、必要なHTTPヘッダを追加
		xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
		xhr.setRequestHeader("Content-Length", data.length);
			
		// 最後にデータを送信する
		// Firefox のバグに416178により、send()の代わりにsendAsBinary()を使用すること
		xhr.sendAsBinary(data);
		//xhr.send(file);
	};
	reader.readAsBinaryString(file);
}
	
// 指定された画像に対する処理
function handleFiles(files) {
	if (!files.length) {
		fileList.innerHTML = "<p>No files selected!</p>";
	} else {
		var list = document.createElement("ul");
		for (var i = 0; i < files.length; i++) {
			var li = document.createElement("li");
			list.appendChild(li);
		      
			var img = document.createElement("img");
			img.classList.add("obj");
			img.file = files[i];
			img.src = window.URL.createObjectURL(files[i]);
			img.height = 60;
			img.onload = function(e) {
				window.URL.revokeObjectURL(this.src);
			}
			li.appendChild(img);
		      
			var info = document.createElement("span");
			info.innerHTML = files[i].name + ": " + files[i].size + " bytes";
			li.appendChild(info);
		}
		fileList.appendChild(list);
	}
}
	
	
function sendFiles() {
	// ".obj" が指定されているタグを列挙(今回はimgタグに指定している)
	var imgs = document.querySelectorAll(".obj");
	
	// 1ファイルあたりのプログレスバーの進捗数を求める
	var oneFileProgress = 100 / imgs.length;
	
	// 全体のプログレスバーの初期化
	uploadProgressTotal.value = 0;
	
	// 各imgタグを送信
	for (var i = 0; i < imgs.length; i++) {
		new FileUpload(imgs[i], imgs[i].file);
		// 全体のプログレスバーを進める
		uploadProgressTotal.value += oneFileProgress;
		// 全体のプログレスバーが100を超えたら戻す
		uploadProgressTotal.value %= 100;
		
	}
}
	

package acceptImgs;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.w3c.dom.*;
import org.xml.sax.SAXException;





public class acceptImgs extends HttpServlet{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest request,
			HttpServletResponse response)
			throws ServletException, IOException{
			
		PrintWriter out = response.getWriter();
		out.println("test");
		
	}
	
	
	public void doPost(HttpServletRequest request,
						HttpServletResponse response)
						
		throws ServletException, IOException{
	
		
			DiskFileItemFactory factory = new DiskFileItemFactory();
			ServletFileUpload sfu = new ServletFileUpload(factory);
			
			try{
				List<org.apache.commons.fileupload.FileItem> list = sfu.parseRequest(request);
				Iterator iterator = list.iterator();
				
				while(iterator.hasNext()){
					FileItem item = (FileItem) iterator.next();
					fileSave(item);
				}
			}
			catch(org.apache.commons.fileupload.FileUploadException e){
				e.printStackTrace();
				
			}
			
			try {
				readAlbumInfoXML();
			} catch (ParserConfigurationException e) {
				// TODO 自動生成された catch ブロック
				e.printStackTrace();
			}
		
	}
	
	public void fileSave(FileItem item){
		ServletContext context = this.getServletContext();
		File saveDirPath = new File(context.getRealPath("saveDir"));
		
		if(saveDirPath.exists() == false){
			saveDirPath.mkdir();
		}
		
		String saveDirPathString = saveDirPath.getAbsolutePath();
		
		File saveImgFile = new File(saveDirPathString + "/" + item.getName());
		try{
			item.write(saveImgFile);
		}
		catch(Exception e){
			e.printStackTrace();
		}
		
	}
	
	// クライアントからアップロードされたアルバム情報XMLを開き、記載された情報を読み込む
	public void readAlbumInfoXML() throws ParserConfigurationException{
		ServletContext context = this.getServletContext();
		File saveDirPath = new File(context.getRealPath("saveDir"));
		
		// アップロード直後のテンポラリフォルダのパスの作成。本来ならば、fileSave() から一時仮置の保存先フォルダを受け取るべき
		String saveDirPathString = saveDirPath.getAbsolutePath();
		
		DocumentBuilderFactory factory  = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		
		File f = new File( saveDirPathString +"/uploadinfo.xml");
		try {
			Document doc = builder.parse( f );
			Element root = doc.getDocumentElement();
			Object id = root.getAttribute("id");
			Object ps = root.getAttribute("ps");
			Object albumId = root.getAttribute("albumId");
			Object uploadId = root.getAttribute("uploadId");
			
		} catch (SAXException | IOException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		}
		
		
	}
	

	

}

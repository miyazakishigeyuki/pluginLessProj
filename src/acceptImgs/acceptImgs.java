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

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;



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
	

	

}

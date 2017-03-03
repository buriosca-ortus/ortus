package cz.burios.ortus.page;

//import static cz.burios.wt.html.Tags.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import cz.burios.web.page.WPage;
import cz.burios.wt.Generator;
import cz.burios.wt.html.Document;

@WebServlet("/pages/PageBuilder")
public class PageBuilder extends HttpServlet {
	
	private static final long serialVersionUID = 5445994115811576811L;
	
	private java.util.Map<String, String> factories = new HashMap<String, String>();  
	
	public PageBuilder() {
		factories.put("PG-LOGIG", "cz.burios.ortus.page.LoginPage");
		factories.put("PG-DESKTOP", "");
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		doPost(request, response);
	}
		
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {	
		PrintWriter out = response.getWriter();
		try {
			response.setContentType("text/html");			
			String pageId = request.getParameter("id");
			if (pageId != null && factories.containsKey(pageId)) {
				//Connection conn = DBConnector.getConnection();
				String className = factories.get(pageId);
				Class<?> c = Class.forName(className);
				Object obj = c.newInstance();
				if (obj instanceof WPage) {
					Document document = ((WPage) obj).buildPage();
					Generator visitor = new Generator(out);
					document.accept(visitor);
				}
			} else {
				String html = 
				"<!DOCTYPE html>" + 
				"<html>" + 
					"<head></head>" + 
					"<body>" + 
						"PageID:" + pageId + "<br>" +
					"</body>" + 
				"</html>";
				out. println(html);
			}
		} catch (Exception exc) {
			exc.printStackTrace();
		} finally {
			if (out != null) out.flush();
		}
	}
}

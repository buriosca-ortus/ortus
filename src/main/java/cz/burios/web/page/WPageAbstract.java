package cz.burios.web.page;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import cz.burios.web.WApplication;
import cz.burios.wt.Generator;
import cz.burios.wt.html.Document;

//import org.jsoup.Jsoup;

public abstract class WPageAbstract extends HttpServlet {

	private static final long serialVersionUID = -2465864031083385744L;

	protected ServletContext application;
	protected HttpSession session;
	protected HttpServletRequest request;
	protected HttpServletResponse response;

	protected String webappUrl;
	protected String webappTitle;
	protected String webappTheme = "metro";

	/**
     * @see HttpServlet#HttpServlet()
     */
	public WPageAbstract() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//System.out.println("WPageAbstract.doPost()");
		response.setContentType("text/html; charset=UTF-8");
		
		PrintWriter out = response.getWriter();
		try {
			if (WApplication.getBaseUrl() == null) {
				String path = request.getContextPath();
				String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "";
				//System.out.println("basePath: " + basePath);
				WApplication.setBaseUrl(basePath); 
			}			
			setRequest(request);
			setResponse(response);
			
			Generator visitor = new Generator(out);
			Document document = buildPage();
			document.accept(visitor);
		} catch (Exception exc) {
			exc.printStackTrace();
		} finally {
			if (out != null) out.flush();
		}
	}
	
	protected abstract Document buildPage() throws ServletException, IOException;

	protected String refactor(String text, Map<String, String> words) {
		for (Map.Entry<String, String> e : words.entrySet()) {
			text = text.replaceAll("\\$\\("+e.getKey()+"\\)", e.getValue());
		}
		return text;
	}

	protected Map<String, Object> request2params(HttpServletRequest request) {
		Map<String, Object> params = new HashMap<String, Object>(); 
		Enumeration<String> e = request.getParameterNames();
		while (e.hasMoreElements()) {
			String key = e.nextElement();
			params.put(key, request.getParameter(key));
		}
		e = request.getAttributeNames();
		while (e.hasMoreElements()) {
			String key = e.nextElement();
			params.put(key, request.getAttribute(key));
		}
		return params;
	}

	public ServletContext application() {
		return application;
	}
	
	public void setServletContext(ServletContext application) {
		this.application = application;
	}
	
	public HttpSession session() {
		return session;
	}
	
	public void setSession(HttpSession session) {
		this.session = session;
	}
	
	public HttpServletRequest request() {
		return request;
	}
	
	public void setRequest(HttpServletRequest request) {
		if (request != null) { session = request.getSession(); }
		if (request != null && session != null) { application = session.getServletContext(); }
		this.request = request;
	}
	
	public HttpServletResponse response() {
		return response;
	}
	
	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}	

}

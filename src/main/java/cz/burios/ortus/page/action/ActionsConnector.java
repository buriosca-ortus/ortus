package cz.burios.ortus.page.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

@WebServlet("")
public class ActionsConnector extends HttpServlet {

	private static final long serialVersionUID = 8575835073042340636L;

	protected ServletContext application;
	protected HttpSession session;
	protected HttpServletRequest request;
	protected HttpServletResponse response;
	

	public ActionsConnector() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		try {
			this.setRequest(request);
			this.setResponse(response);
			Map<String, Object> params = makeParams(request);
			Object result = execute(params);
			String json = new Gson().toJson(result); 
			out.print(json);
			return;
		} catch (Exception exc) {
			exc.printStackTrace();
		} finally {
			if (out != null) out.flush();
		}
	}

	// -----  -----------------------------------------------------------------
	
	public Object execute(Map<String, Object> params) throws Exception {
		return null;
	}
	
	// -----  -----------------------------------------------------------------
	
	protected Map<String, Object> makeParams(HttpServletRequest request) {
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

	// -----  -----------------------------------------------------------------

	public ServletContext application() {
		return application;
	}
	
	public void setServletContext(ServletContext application) {
		this.application = application;
	}
	
	public HttpSession getSession() {
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

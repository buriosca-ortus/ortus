package cz.burios.ortus;

import java.io.IOException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

//@WebServlet("/StartUp")
public class StartUp extends HttpServlet {

	private static final long serialVersionUID = 8115650258949702251L;

	public StartUp() {
		super();
	}

	public void init(ServletConfig config) throws ServletException {
		System.out.println("StartUp.init(config)");
		try {
			Context initContext = new InitialContext();
			DataSource ds = null;
			boolean ok = false;
			try {
				Context envContext = (Context) initContext.lookup("java:jboss/datasources");
				ds = (DataSource) envContext.lookup("OrtusDS");
				ok = true;
			} catch (Exception e) {
				try {
					Context envContext = (Context) initContext.lookup("java:/comp/env");
					ds = (DataSource) envContext.lookup("jboss/datasources/OrtusDS");
					ok = true;
				} catch (Exception exc) {
					exc.printStackTrace();
				}
			}
			System.out.println("StartUp.init().ds: " + ds);
			if (ok) {
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		/*
		*/
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

}

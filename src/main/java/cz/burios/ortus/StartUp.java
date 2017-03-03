package cz.burios.ortus;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.h2.jdbcx.JdbcConnectionPool;
import org.h2.jdbcx.JdbcDataSource;
import org.h2.tools.Server;

import cz.burios.data.DBContext;

//@WebServlet("/StartUp")
public class StartUp extends HttpServlet {

	private static final long serialVersionUID = 8115650258949702251L;

	public StartUp() {
		super();
	}

	@SuppressWarnings("static-access")
	public void init(ServletConfig config) throws ServletException {
		System.out.println("StartUp.init(config)");
		Connection conn = null;
		try {
			//String driver = "org.h2.Driver";
			//Class.forName(driver);
			JdbcDataSource ds = new JdbcDataSource();
			ds.setURL("jdbc:h2:tcp://localhost:9092/~/ortus;INIT=RUNSCRIPT FROM 'classpath:import.sql';");
			ds.setUser("sa");
			ds.setPassword("sa");
			Context ctx = new InitialContext();
			ctx.bind("jdbc/OrtusDS", ds);
			/*
			JdbcConnectionPool cp = JdbcConnectionPool.create("jdbc:h2:tcp://localhost:9092/~/ortus;DB_CLOSE_ON_EXIT=FALSE;", "sa", "sa");
			conn = cp.getConnection();
			conn.close(); 
			cp.dispose();
			*/
			/*
			Context initContext = new InitialContext();
			DataSource ds = null;
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
			*/			
			boolean ok = true;
			System.out.println("StartUp.init().ds: " + ds);
			if (ok) {
				DBContext.instance().initialize(ds);
				conn = DBContext.instance().getConnection();
				System.out.println("StartUp.init().conn: " + conn);
				try (Statement stmt = conn.createStatement()) {
					
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (conn != null) try { conn.close(); } catch (Exception ecx) {}
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

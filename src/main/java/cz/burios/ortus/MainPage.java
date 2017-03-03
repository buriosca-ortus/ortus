package cz.burios.ortus;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cz.burios.data.DBContext;

@WebServlet("/MainPage")
public class MainPage extends HttpServlet {
	
	private static final long serialVersionUID = 3381433263716907125L;

	public MainPage() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter out = response.getWriter();
		try {
			response.setContentType("text/html");
			response.setCharacterEncoding("UTF-8");
			
			out.append("Served at: ").append(request.getContextPath());
			out.append("<br>");
			try (Connection conn = DBContext.getConnection()) {
				out.append("SQL Connection: ").append("" + conn);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}

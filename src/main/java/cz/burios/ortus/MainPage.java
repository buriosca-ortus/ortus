package cz.burios.ortus;

import static cz.burios.wt.html.Tags.*;

import java.io.IOException;

import javax.servlet.ServletException;

//import java.io.IOException;
//import java.io.PrintWriter;

//import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
//import javax.servlet.http.HttpServlet;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;

import cz.burios.web.WApplication;
import cz.burios.web.page.WPage;
import cz.burios.wt.html.Body;
import cz.burios.wt.html.Document;
import cz.burios.wt.html.Head;

@WebServlet("/MainPage")
public class MainPage extends WPage {

	private static final long serialVersionUID = -6234649450239924025L;

	public MainPage() {
        super();
    }

	@Override
	public Document buildPage() throws ServletException, IOException {
		WApplication.setTitle(application().getServletContextName());
		return super.buildPage();
	}

	@Override
	public Head buildHead(Head head) {
		head = super.buildHead(head);
		head.add(
			link().rel("stylesheet").type("text/css").href(WApplication.getBaseUrl()+"/js/nestui/themes/metro-blue/nestui.css"),
			link().rel("stylesheet").type("text/css").href(WApplication.getBaseUrl()+"/pages/css/" + this.getClass().getSimpleName() + ".css"),
			
			style("text/css").text("html, body { width: 100%; height: 100%; margin: 0px; padding: 0px; overflow: hidden; font: 12px Verdana, sans-serif; }"),
			
			javaScript(WApplication.getBaseUrl()+"/js/jquery-1.11.3.js"),
			javaScript(WApplication.getBaseUrl()+"/js/nestui/nestui.all.js")
		);
		return head;
	}
	
	@Override
	public Body buildBody(Body body) {
		body.add(
			div().css("nestui-layout").style("width:100%;height:100%;").add(
				div().data("options", "region:'north'").style("height:50px;background-color: black; color: white;").add(
					div().css("logo-image"),
					div().text(""+WApplication.getTitle()).css("logo-title")
				),
				div().data("options", "region:'center',href:'"+WApplication.getBaseUrl()+"/LoginPage'")
				//div().data("options", "region:'east'").style("width:400px; padding: 15px;")
			)
		);
		return body;
	}


	/*
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter out = response.getWriter();
		try {
			response.setContentType("text/html");
			response.setCharacterEncoding("UTF-8");
			
			out.append("<a href='/sql'>SQL</a>");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	*/
}

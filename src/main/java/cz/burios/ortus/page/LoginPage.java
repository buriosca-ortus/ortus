package cz.burios.ortus.page;

import static cz.burios.wt.html.Tags.*;

import javax.servlet.annotation.WebServlet;

import cz.burios.web.WApplication;
import cz.burios.web.page.WPage;
import cz.burios.wt.html.Body;
import cz.burios.wt.html.Head;

@WebServlet("/LoginPage")
public class LoginPage extends WPage {

	private static final long serialVersionUID = -7263780952632415880L;

	public LoginPage() {
		super();
	}

	@Override
	protected Head buildHead(Head head) {
		head = super.buildHead(head);
		head.add(
			link().rel("stylesheet").type("text/css").href(WApplication.getBaseUrl()+"/js/gears/themes/metro-gray/gears.css"),
			link().rel("stylesheet").type("text/css").href(WApplication.getBaseUrl()+"/pages/css/" + this.getClass().getSimpleName() + ".css"),
			
			style("text/css").text("html, body { width: 100%; height: 100%; margin: 0px; padding: 0px; overflow: hidden; font: 12px Verdana, sans-serif; }"),
			
			javaScript(WApplication.getBaseUrl()+"/js/jquery-1.11.3.js"),
			javaScript(WApplication.getBaseUrl()+"/js/gears/gears.all.min.js")
		);
		return head;
	}
	
	@Override
	protected Body buildBody(Body body) {
		body.add(
			div().css("nestui-layout").data("options", "fit:true").style("width:100%;height:100%;").add(
				div().data("options", "region:'center'"),
				div().data("options", "region:'east'").style("width:400px; padding: 15px;").add(
					form().id("loginForm").method("get").enctype("multipart/form-data").add(
						div().style("margin-bottom:10px; margin-top: 100px;").add(
							input().css("nestui-textbox").name("USER_NAME").style("width:100%").data("options","label:'Jméno:',required:true").value("demo")
						),
						div().style("margin-bottom:10px").add(
							input().css("nestui-passwordbox").name("PASSWORD").style("width:100%").data("options", "label:'Heslo:',required:true").value("demo")
						)
					), 	
					div().style("text-align:center;padding:5px 0").add(
						a().id("regisBtn").href("javascript:void(0)").css("nestui-linkbutton").style("width:80px").onclick("alert('doRegis()')").text("Registrace"),
						a().id("loginBtn").href("javascript:void(0)").css("nestui-linkbutton").style("width:80px").onclick("alert('doLogin()')").text("Přihlásit")
					)
					/*	
					*/
				)
			)
		);
		return body;
	}

}

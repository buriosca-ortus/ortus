package cz.burios.web.page;

import static cz.burios.wt.html.Tags.*;

import java.io.IOException;

import javax.servlet.ServletException;

import cz.burios.web.WApplication;
import cz.burios.wt.html.Body;
import cz.burios.wt.html.Document;
import cz.burios.wt.html.Head;

public class WPage extends WPageAbstract {

	private static final long serialVersionUID = 6317643796226825121L;

	public WPage() {
		super();
	}

	@Override
	protected Document buildPage() throws ServletException, IOException {
		//System.out.println("WPage.buildPage()");
		Document document = new Document();
		buildHead(document.head());
		buildBody(document.body());		
		return document;
	}

	protected Head buildHead(Head head) {
		head.add(
			title().text("" + WApplication.getTitle()),
			meta("text/html; charset=UTF-8").httpEquiv("Content-Type"),
			link().rel("icon").href(WApplication.getBaseUrl() + "/favicon.png")
		);
		return head;
	}
	
	protected Body buildBody(Body body) {
		return body;
	}

}

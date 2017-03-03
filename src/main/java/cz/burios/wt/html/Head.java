package cz.burios.wt.html;

import java.util.ArrayList;

import cz.burios.wt.Visitable;

public class Head extends Tag<Head> {

	public Head() {
		super("head");
		this.inst = this;
		children = new ArrayList<Visitable>();
	}
	
	/** DOMElement attribete profile */
	public Head profile(String value) {
		return this.attr("profile", value);
	}

	public String profile() {
		return attr("profile");
	}
}

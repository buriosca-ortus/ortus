package cz.burios.wt.html;

import java.util.ArrayList;

import cz.burios.wt.Visitable;

public class Style extends Tag<Style> {

	//private static final long serialVersionUID = -4236809510811439726L;

	public Style() {
		super("style");
		this.inst = this;
		children = new ArrayList<Visitable>();
	}

	public Style(String type) {
		this();
		type(type);
	}

	public Style type(String value) {
		attr("type", value);
		return this;
	}

	public String type() {
		return attr("type");
	}
	/*
	public boolean removeType() {
		return removeAttribute("type");
	}
	*/
	public Style media(String value) {
		attr("media", value);
		return this;
	}

	public String media() {
		return attr("media");
	}
	
	/* ----- HTML5 ----- */
	
	public Style scoped(String value) {
		attr("scoped", value);
		return this;
	}

	public String scoped() {
		return attr("scoped");
	}

}

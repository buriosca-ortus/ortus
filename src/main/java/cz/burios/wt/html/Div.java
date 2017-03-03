package cz.burios.wt.html;

import java.util.ArrayList;

import cz.burios.wt.Visitable;

public class Div extends Tag<Div> {

	public Div() {
		super("div");
		this.inst = this;
		children = new ArrayList<Visitable>();
	}

	public Div(String tag) {
		super(null);
	}

	/** DOMElement attribute align */
	public Div align(String value) {
		return this.attr("align", value);
	}

	public String align() {
		return attr("align");
	}
}

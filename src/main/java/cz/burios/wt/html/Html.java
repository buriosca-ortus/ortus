package cz.burios.wt.html;

import java.util.ArrayList;

import cz.burios.wt.Visitable;

public class Html extends Tag<Html> {

	public Html() {
		super("html");
		this.inst = this;
		children = new ArrayList<Visitable>();
	}

	public Html xmlns(String value) {
		return this.attr("xmlns", value);
	}

	public String xmlns() {
		return attr("xmlns");
	}
}

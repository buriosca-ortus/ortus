package cz.burios.wt.html;

import java.util.ArrayList;

import cz.burios.wt.Visitable;

public class P extends Tag<P> {

	public P() {
		super("p");
		this.inst = this;
		children = new ArrayList<Visitable>();
	}

	public P align(String value) {
		return this.attr("align", value);
	}

	public String align() {
		return attr("align");
	}
}

package cz.burios.wt.html;

import java.util.ArrayList;

import cz.burios.wt.Visitable;

public class Title extends Tag<Title> {

	public Title() {
		super("title");
		this.inst = this;
		children = new ArrayList<Visitable>();
	}
	
}

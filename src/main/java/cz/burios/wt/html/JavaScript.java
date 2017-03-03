package cz.burios.wt.html;

import java.util.ArrayList;

import cz.burios.wt.Visitable;
import cz.burios.wt.xml.Text;

public class JavaScript extends Script {

	public JavaScript() {
		super("text/javascript");
		this.inst = this;
		children = new ArrayList<Visitable>();
	}
	
	public JavaScript(String src) {
		this();
		this.src(src);
	}
	
	@Override
	public Script text(String text) {
		add(new Text(text));
		return this;
	}
	
	public Script content(Visitable expr) {
		this.add(expr);
		return this;
	}

}

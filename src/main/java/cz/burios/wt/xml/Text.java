package cz.burios.wt.xml;

import static cz.burios.wt.Generator.*;

import cz.burios.wt.CodeVisitor;
import cz.burios.wt.Visitable;

public class Text implements Visitable {

	protected String text;
	
	public Text(String text) {
		this.text = text;
	}

	@Override
	public String toString() {
		return "" + text;
	}

	@Override
	public void accept(CodeVisitor visitor) {
		try {
			visitor.out().append(this.text).append(LF);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

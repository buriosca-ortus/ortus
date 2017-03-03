package cz.burios.wt.html;

public class Br extends Tag<Br> {

	//private static final long serialVersionUID = 3835483935880806008L;

	public Br() {
		super("br");
	}

	@Override
	public boolean hasAttributes() {
		return false;
	}

	@Override
	public boolean hasChildren() {
		return false;
	}
}

package cz.burios.wt.html;

import static cz.burios.wt.Generator.*;

import cz.burios.wt.CodeVisitor;
import cz.burios.wt.Visitable;

public class Doctype implements Visitable {

	//private static final long serialVersionUID = 6406074779201585232L;
	
	protected String name;
	private DocumentType spec;

	public Doctype() {
		this(DocumentType.HTML);
	}

	public Doctype(DocumentType spec) {
		this.name = "!DOCTYPE";
		this.spec = spec;
	}

	public DocumentType spec() {
		return this.spec;
	}

	public boolean hasAttributes() {
		return true;
	}
    
	public boolean hasChildren() {
		return false; 
	}

	@Override
	public void accept(CodeVisitor visitor) {
		try {
			visitor.out().append(LT)
				.append("!DOCTYPE")
				.append(SPACE)
				.append("" + spec())
				.append(GT);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

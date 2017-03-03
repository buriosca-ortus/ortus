package cz.burios.wt.html;

import cz.burios.wt.CodeVisitor;
import cz.burios.wt.Visitable;
import cz.burios.wt.xml.IElement;

public class Document implements Visitable {

	protected Doctype doctype;
	protected Html html;
	protected Head head;
	protected Body body;

	public Document() {
		this(DocumentType.HTML);
	}

	public Document(DocumentType spec) {
		doctype = new Doctype(spec);
		html = new Html();
		head = new Head();
		body = new Body();
		html.add(head);
		html.add(body);
	}

	public Doctype doctype() {
		return doctype;
	}
	
	public Html html() {
		return html;
	}
	
	public Document head(IElement<?>... children) {
		head.add(children);
		return this;
	}

	public Head head() {
		return this.head;
	}
	
	public Document body(IElement<?>... children) {
		body.add(children);
		return this;
	}
	
	public Body body() {
		return this.body;
	}

	@Override
	public void accept(CodeVisitor visitor) {
		//visitor.visit(this);
		doctype().accept(visitor);
		html().accept(visitor);
	}
}

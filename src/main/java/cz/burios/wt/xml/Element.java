package cz.burios.wt.xml;

import static cz.burios.wt.Generator.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import cz.burios.wt.CodeVisitor;
import cz.burios.wt.Visitable;


public class Element<T> implements IElement<T> {

	protected String name;
	protected IElement<?> parent;
	protected List<Attribute> attributes;
	protected List<Visitable> children;
	protected Visitable content;
	
	protected T inst;
	
	public Element(String name) {
		this.name = name;
		//attributes = new ArrayList<Attribute>(); 
		//children = new ArrayList<Visitable>(); 
	}

	@Override
	public String getName() {
		return  this.name;
	}

	@Override
	public IElement<?> getParent() {
		return parent;
	}
	
	@Override
	public void setParent(IElement<?> parent) {
		this.parent = parent;
	}
	
	/* ----- Attributes -----  */
	
	@Override
	public T attr(String name, String value) {
		if (value != null) {
			if (attributes == null) attributes = new ArrayList<Attribute>(); 
			for (Attribute attribute : attributes) {
				if (attribute.getName().equals(name)) {
					attribute.setValue(value);
					return this.inst;
				}
			}
			attributes.add(new Attribute(name, value));
		}
		return this.inst;
	}

	@Override
	public String attr(String name) {
		if (!hasAttributes()) return null;
		for (Attribute attribute : attributes) {
			if (attribute.getName().equals(name)) {
				return attribute.getValue();
			}
		}
		return null;
	}

	@Override
	public boolean removeAttribute(String name) {
		if (!hasAttributes()) return false;
		for (Attribute attribute : attributes) {
			if (attribute.getName().equals(name)) {
				return attributes.remove(attribute);
			}
		}
		return false;
	}

	@Override
	public boolean hasAttributes() {
		return attributes != null && !attributes.isEmpty();	
	}

	@Override
	public List<Attribute> getAttributes() {
		return this.attributes;
	}

	/* ----- Visitable ----- */
	
	@Override
	public T add(Visitable child) {
		if (this == child) { throw new Error("Cannot append a node to itself."); }
		if (child instanceof IElement<?>) 
			((IElement<?>)child).setParent(this);
		if (children == null) children = new ArrayList<Visitable>();
		children.add(child);
		return this.inst;
	}

	@Override
	public T add(int index, Visitable child) {
		if (this == child) { throw new Error("Cannot append a node to itself."); }
		if (child instanceof IElement<?>)
			((IElement<?>)child).setParent(this);
		if (children == null) children = new ArrayList<Visitable>();
		children.add(index, child);
		return this.inst;
	}
	
	@Override
	public T add(List<Visitable> children) {
		if (children != null) {
			for (Visitable child : children) {
				add(child);
			}
		}
		return this.inst;
	}

	@Override
	public T add(Visitable... children) {
		for (int i = 0; i < children.length; i++) {
			add(children[i]);
		}
		return this.inst;
	}
	
	/* -----  ----- */
	
	@Override
	public Visitable getChild(int index) {
		return children.get(index);
	}
	
	/* -----  ----- */
	
	@Override
	public List<Visitable> getChildren() {
		return this.children;
	}

	@Override
	public boolean hasChildren() {
		return children != null && !children.isEmpty();
	}

	@Override
	public void setChildren(List<Visitable> children) {
		this.children = children;
	}

	/* ----- Content ----- */

	@Override
	public T text(String text) {
		this.add(new Text(text));
		return this.inst;
	}

	/* ----- Visitable ----- */
	
	@Override
	public void accept(CodeVisitor visitor) {
		try {
			visitor.out().append(LT);
			visitor.out().append("" + name);
			if (hasAttributes()) {
				visitor.out().append(SPACE);
				for (Iterator<Attribute> it = attributes.iterator(); it.hasNext();) {
					Attribute attribute = it.next();
					attribute.accept(visitor); 
					if (it.hasNext())
						visitor.out().append(SPACE);
				}
			}
			if (children != null) {
				visitor.out().append(GT);
				if (!children.isEmpty()) visitor.out() .append(LF);
				for (Visitable child : children) {
					child.accept(visitor);
				}
				// vypíše: </name>
				visitor.out().append(LT).append(SLASH).append(getName()).append(GT).append(LF);
			} else {
				// vypíše: />
				visitor.out().append(SLASH).append(GT).append(LF);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

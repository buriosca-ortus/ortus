package cz.burios.wt.xml;

import java.util.List;

import cz.burios.wt.Visitable;

public interface IElement<T> extends Visitable {

	public String getName();
	
	public IElement<?> getParent();
	
	public void setParent(IElement<?> parent);
	
	/* -----  ----- */
	
	public T attr(String name, String value);
	
	public String attr(String name);
	
	public boolean removeAttribute(String name);
	
	public boolean hasAttributes();

	public List<Attribute> getAttributes();
	
	/* -----  ----- */

	public T add(Visitable child);

	public T add(int index, Visitable child);

	public T add(List<Visitable> children);

	public T add(Visitable... children);
	
	/* -----  ----- */
	
	public Visitable getChild(int index);
	
	public List<Visitable> getChildren();
	
	public boolean hasChildren();
	
	public void setChildren(List<Visitable> children);
	
	/* -----  ----- */
		
	public T text(String text);
}

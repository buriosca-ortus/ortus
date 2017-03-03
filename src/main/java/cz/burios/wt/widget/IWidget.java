package cz.burios.wt.widget;

import java.util.List;

import cz.burios.wt.Visitable;
import cz.burios.wt.xml.Attribute;
import cz.burios.wt.xml.IElement;

public interface IWidget<T> extends Visitable {
	
	public String getName();
	
	public IElement<?> getParent();
	
	public void setParent(IElement<?> parent);
	
	/* -----  ----- */
	
	public T attr(String name, String value);
	
	public List<Attribute> getAttributes();
	
	public void setAttribute(String name, String value);

	public String getAttribute(String name);
	
	/* -----  ----- */

	public List<Visitable> getChildren();

	public Visitable getChild(int index);

}

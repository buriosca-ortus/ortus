package cz.burios.wt.xml;

import cz.burios.wt.Visitable;

public interface IAttribute extends Visitable {

	public String getName();

	public void setName(String name);

	public String getValue();

	public void setValue(String value);

}

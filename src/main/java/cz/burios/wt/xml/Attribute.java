package cz.burios.wt.xml;

import static cz.burios.wt.Generator.*;

import cz.burios.wt.CodeVisitor;

public class Attribute implements IAttribute {

	private String name;
	private String value;

	public Attribute(String name, String value) {
		this.name = name;
		this.value = value;
		try {
			assert (this.name != null) : this.name;
		} catch (AssertionError e) {
			System.out.println("Caught AssertionError for 'tagName' attribute");
		}
	}

	public Attribute(String name) {
		this.name = name;
		this.value = null;
	}

	@Override
	public void accept(CodeVisitor visitor) {
		try {
			try {
				visitor.out().append(getName());
				if (getValue() != null) {
					visitor.out().append(EQ);
					visitor.out().append(QUOT);
					visitor.out().append(getValue());
					visitor.out().append(QUOT);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public String getName() {
		return name;
	}

	@Override
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String getValue() {
		return value;
	}

	@Override
	public void setValue(String value) {
		this.value = value;
	}
}

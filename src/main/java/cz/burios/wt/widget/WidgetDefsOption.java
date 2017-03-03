package cz.burios.wt.widget;

import static cz.burios.wt.Generator.*;

import cz.burios.wt.CodeVisitor;

public class WidgetDefsOption implements IWidgetDefsOption {

	protected String name;
	protected Object value;
	
	public WidgetDefsOption(String key, Object obj) {
		this.name = key;
		this.value = obj;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	@Override
	public void accept(CodeVisitor visitor) {
		try {
			Appendable out = visitor.out();
			out.append(TAB)
				.append(name)
				.append(COLON)
				.append(SPACE);
			if (value instanceof Number) out.append(value.toString());
			else if (value instanceof String) 
				out.append(QUOT).append(value.toString()).append(QUOT);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}

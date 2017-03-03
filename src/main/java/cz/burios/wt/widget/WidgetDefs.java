package cz.burios.wt.widget;

import static cz.burios.wt.Generator.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import cz.burios.wt.CodeVisitor;
import cz.burios.wt.widget.Widget.WidgetClass;

public class WidgetDefs implements IWidgetDefs {
	
	//protected Object selector;
	protected WidgetClass widgetClass;
	protected List<WidgetDefsOption> options;
	
	public WidgetDefs(String id, WidgetClass widget) {
		this.widgetClass = widget;
		this.options = new ArrayList<WidgetDefsOption>(); 
		this.id(id);
	}

	public WidgetClass widget() {
		return widgetClass;
	}

	public void widget(WidgetClass widgetClass) {
		this.widgetClass = widgetClass;
	}
	
	public List<WidgetDefsOption> getOptions() {
		return options;
	}

	public void setOptions(List<WidgetDefsOption> options) {
		this.options = options;
	}

	public boolean hasOptions() {
		return options != null && !options.isEmpty();
	}

	public void setOption(String name, Object value) {
		if (value != null) {
			if (options == null) options = new ArrayList<WidgetDefsOption>(); 
			for (WidgetDefsOption e : options) {
				if (e.getName().equals(name)) {
					e.setValue(value);
					return;
				}
			}
			options.add(new WidgetDefsOption(name, value));
		}
		return;
	}

	public Object getElement(String name) {
		for (WidgetDefsOption e : options) {
			if (e.getName().equals(name)) {
				return e.getValue();
			}
		}
		return null;
	}

	public boolean removeElement(String name) {
		for (WidgetDefsOption e : options) {
			if (e.getName().equals(name)) {
				return options.remove(e);
			}
		}
		return false;
	}
	
	/*
	 * id
	 * String
	 * The id attribute of this component.	
	 * null
	 */
	public String id() {
		return (String) getElement("id");
	}
	
	public WidgetDefs id(String value) {
		setOption("id", value);
		return this; 
	}

	@Override
	public void accept(CodeVisitor visitor) {
		try {
			Appendable out = visitor.out();

			out.append("$(");
			out.append(QUOT + NET + id() + QUOT);
			out.append(")." + widgetClass + "(");
			if (hasOptions()) {
				List<WidgetDefsOption> elements = getOptions();
				Iterator<WidgetDefsOption> it = elements.iterator();
				out.append(CRLF);
				while (it.hasNext()) {
					WidgetDefsOption e = it.next();
					e.accept(visitor);	
					if (it.hasNext()) out.append(COMMA);
					out.append(CRLF);
				}
			}
			out.append(")").append(SEMICOLON).append(CRLF);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}


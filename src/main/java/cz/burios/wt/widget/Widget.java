package cz.burios.wt.widget;

import java.util.List;

import cz.burios.wt.CodeVisitor;
import cz.burios.wt.Visitable;
import cz.burios.wt.html.ITag;
import cz.burios.wt.html.JavaScript;
import cz.burios.wt.html.Tag;
import cz.burios.wt.xml.Attribute;
import cz.burios.wt.xml.IElement;

public class Widget<T extends ITag<T>> implements IWidget<T> {

	public enum WidgetClass {
		accordion,
		calendar,
		combo,
		combobox,
		combogrid,
		combotree,
		combotreegrid,
		datagrid,
		datalist,
		datebox,
		datetimebox,
		datetimespinner,
		dialog,
		draggable,
		droppable,
		filebox,
		form,
		layout,
		linkbutton,
		menu,
		menubutton,
		messager,
		mobile,
		numberbox,
		numberspinner,
		pagination,
		panel,
		parser,
		passwordbox,
		progressbar,
		propertygrid,
		resizable,
		searchbox,
		slider,
		spinner,
		splitbutton,
		switchbutton,
		tabs,
		textbox,
		timespinner,
		tooltip,
		tree,
		treegrid,
		validatebox,
		window
	};

	protected Tag<T> tag;
	protected WidgetDefs opts;
	
	public Widget(Tag<T> tag, WidgetDefs options) {
		this.tag = tag;
		this.opts = options;
	}
	
	public WidgetDefs opts() {
		return opts;
	}

	@Override
	public void accept(CodeVisitor visitor) {
		this.tag.accept(visitor);
		JavaScript script = new JavaScript();
		script.add(opts);
		script.accept(visitor);
	}
	
	public void opts(WidgetDefs opts) {
		this.opts = opts;
	}

	protected static WidgetDefs createOptions(WidgetClass widgetClass) {
		return new WidgetDefs("", widgetClass);
	}

	public Tag<T> tag() {
		return tag;
	}

	public void tag(Tag<T> tag) {
		this.tag = tag;
	}

	@Override
	public String getName() {
		return tag.getName();
	}

	@Override
	public IElement<?> getParent() {
		return tag.getParent();
	}

	@Override
	public void setParent(IElement<?> parent) {
		tag.setParent(parent);
	}

	@Override
	public T attr(String name, String value) {
		return tag.attr(name, value);
	}

	@Override
	public List<Attribute> getAttributes() {
		return tag.getAttributes();
	}

	@Override
	public void setAttribute(String name, String value) {
		tag.attr(name, value);	
	}

	@Override
	public String getAttribute(String name) {
		return tag.attr(name);
	}

	@Override
	public List<Visitable> getChildren() {
		return tag.getChildren();
	}
	
	@Override
	public Visitable getChild(int index) {
		return tag.getChild(index);
	}
	
	public T text(String text) {
		return (T) tag.text(text);
	}
	
	// ----- Getter & setter -----
	
	// id
	public Widget<T> id(String value) {
		this.tag.id(value);
		return this; 
	}

	public String id() {
		return this.tag.id();
	}
	
	// class	
	public Widget<T> css(String value) {
		this.tag.css(value);
		return this; 
	}

	public String css() {
		return this.tag.css();
	}

	// title
	public Widget<T> title(String value) {
		this.tag.title(value);
		return this;
	}

	public String title() {
		return this.tag.title();
	}

	// style	
	public Widget<T> style(String value) {
		this.tag.style(value);
		return this;
	}

	public String style() {
		return this.tag.style();
	}

	// dir
	public Widget<T> dir(String value) {
		this.tag.dir(value);
		return this;
	}

	public String dir() {
		return this.tag.dir();
	}

	// lang
	//public String lang;
	public Widget<T> lang(String value) {
		this.tag.lang(value);
		return this;
	}

	public String lang() {
		return this.tag.lang();
	}
	
	// xml:lang
	public Widget<T> xmlLang(String value) {
		this.tag.xmlLang(value);
		return this;
	}

	public String xmlLang() {
		return this.tag.xmlLang();
	}

	public Widget<T> dataOption(String value) {
		this.tag.attr("data-option", value);
		return this;
	}

	public String dataOption() {
		return this.tag.attr("data-option");
	}

	/*
	public int clientHeight;
	public int clientWidth;
	public int height;
	public int offsetHeight;
	public int offsetLeft;
	public Tag offsetParent;
	public int offsetTop;
	public int offsetWidth;
	public int scrollHeight;
	public int scrollLeft;
	public int scrollTop;
	public int scrollWidth;
	public int width;
	public int tabIndex;

	public boolean contentEditable;
	public boolean contextMenu;
	public boolean draggable;
	public boolean dropZone;
	public boolean hidden;
	public boolean spellCheck;
	public boolean translate;

	// events
	public T onblur;
	public T onchange;
	*/
	//public T onclick;
	public Widget<T> onclick(String value) {
		this.tag.attr("onclick", value);
		return this;
	}

	public String onclick() {
		return this.tag.attr("onclick");
	}
	/*
	public T ondblclick;
	public T onerror;
	public T onfocus;
	public T onkeydown;
	public T onkeypress;
	public T onkeyup;
	public T onmousedown;
	public T onmousemove;
	public T onmouseout;
	public T onmouseover;
	public T onmouseup;
	public T onselect;

	public T oncontextmenu;
	public T onformchange;
	public T onforminput;
	public T oninput;
	public T oninvalid;

	// drag & drop
	public T ondrag;
	public T ondragend;
	public T ondragenter;
	public T ondragleave;
	public T ondragover;
	public T ondragstart;
	public T ondrop;
	// new mouse
	public T onmousewheel;
	public T onscroll;

	// media
	public T oncanplay;
	public T oncanplaythrough;
	public T ondurationchange;
	public T onemptied;
	public T onended;
	public T onloadeddata;
	public T onloadedmetadata;
	public T onloadstart;
	public T onpause;
	public T onplay;
	public T onplaying;
	public T onprogress;
	public T onratechange;
	public T onreadystatechange;
	public T onseeked;
	public T onseeking;
	public T onstalled;
	public T onsuspend;
	public T ontimeupdate;
	public T onvolumechange;
	public T onwaiting;  	 
	*/

}

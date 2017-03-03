package cz.burios.wt.html;

import cz.burios.wt.xml.IElement;

public interface ITag<T> extends IElement<T> {

	
	/** DOMElement attribute id */
	public T id(String value);

	public String id();
	
	/** DOMElement attribute class */	
	public T css(String value);

	public String css();

	/** DOMElement attribute title */
	public T title(String value);

	public String title();

	/** DOMElement attribute style */
	public T style(String value);

	public String style();

	/** DOMElement attribute dir */
	public T dir(String value);

	public String dir();

	/** DOMElement attribute lang */
	public T lang(String value);

	public String lang();
	
	/** DOMElement attribute xml:lang */
	public T xmlLang(String value);

	public String xmlLang();

	/** DOMElement attribute data-xxx */
	public T data(String suffix, String value);

	public String data(String suffix);

	/*
	public int clientHeight;
	public int clientWidth;
	public int height;
	public int offsetHeight;
	public int offsetLeft;
	public Element offsetParent;
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
	*/
	// events
	/*
	public T onblur;
	public T onchange;
	*/
	
	/** DOMElement event onclick */ 
	public T onclick(String value);

	public String onclick();
	
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

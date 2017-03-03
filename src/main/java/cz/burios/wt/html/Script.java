package cz.burios.wt.html;

import java.util.ArrayList;

import cz.burios.wt.Visitable;

public class Script extends Tag<Script> {

	public Script() {
		this(null, null);
	}

	public Script(String type) {
		this(type, null);
	}

	public Script(String type, String src) {
		super("script");
		this.inst = this;
		
		if (type != null) type(type);
		if (src != null) src(src);
		children = new ArrayList<Visitable>();
	}

	public Script type(String value) {
		return this.attr("type", value);
	}

	public String type() {
		return this.attr("type");
	}
	/*
	public boolean removeType() {
		return removeAttribute("type");
	}
	*/
	public Script charset(String value) {
		return this.attr("charset", value);
	}

	public String charset() {
		return this.attr("charset");
	}
	/*
	public boolean removeCharset() {
		return removeAttribute("charset");
	}
	*/
	public Script defer(String value) {
		return this.attr("defer", value);
	}

	public String defer() {
		return this.attr("defer");
	}
	/*
	public boolean removeDefer() {
		return removeAttribute("defer");
	}
	*/
	public Script language(String value) {
		return this.attr("language", value);
	}

	public String language() {
		return this.attr("language");
	}
	/*
	public boolean removeLanguage() {
		return removeAttribute("language");
	}
	*/
	public Script src(String value) {
		return this.attr("src", value);
	}

	public String src() {
		return this.attr("src");
	}
	/*
	public boolean removeSrc() {
		return removeAttribute("src");
	}
	*/
	/**
	 * Not supported in HTML5.<br>
	 * Specifies whether whitespace in code should be preserved
	 * 
	 * @param value
	 * @return
	 */
	public Script xmlspace(String value) {
		return this.attr("xmlspace", value);
	}

	public String xmlspace() {
		return this.attr("xmlspace");
	}
	/*
	public boolean removeXmlspace() {
		return removeAttribute("xmlspace");
	}
	*/
	
	/* ----- HTML5 ----- */
	
	/**
	 * Specifies that the script is executed asynchronously (only for external scripts)<br>
	 * Only HTML5
	 * 
	 * @param value
	 * @return
	 */
	public Script async(String value) {
		return this.attr("async", value);
	}

	public String async() {
		return this.attr("async");
	}

}

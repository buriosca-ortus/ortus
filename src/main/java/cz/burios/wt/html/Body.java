package cz.burios.wt.html;

import java.util.ArrayList;

import cz.burios.wt.Visitable;

public class Body extends Tag<Body> {

	public Body() {
		super("body");
		this.inst = this;
		children = new ArrayList<Visitable>();
	}

	/** DOMElement attribete alink */ 
	public Body alink(String value) {
		return this.attr("alink", value);
	}

	public String alink() {
		return attr("alink");
	}

	/** DOMElement attribete background */
	public Body background(String value) {
		return this.attr("background", value);
	}

	public String background() {
		return attr("background");
	}

	/** DOMElement attribete bgcolor */
	public Body bgcolor(String value) {
		return this.attr("bgcolor", value);
	}

	public String bgcolor() {
		return attr("bgcolor");
	}

	/** DOMElement attribete link */
	public Body link(String value) {
		return this.attr("link", value);
	}

	public String link() {
		return attr("link");
	}
	/*
	public Body setText(String value) {
		return this.attr("text", value);
	}

	public String getText() {
		return attr("text");
	}
	*/
	/** DOMElement attribete vlink */
	public Body vlink(String value) {
		return this.attr("vlink", value);
	}

	public String vlink() {
		return attr("vlink");
	}
	
	/* ----- Events ----- */
	
	/** DOMElement event onbeforeunload */
	public Body onbeforeunload(String value) {
		return this.attr("onbeforeunload", value);
	}

	public String onbeforeunload() {
		return attr("onbeforeunload");
	}
	
	/** DOMElement event onerror */
	public Body onerror(String value) {
		return this.attr("onerror", value);
	}

	public String onerror() {
		return attr("onerror");
	}
	
	/** DOMElement event onhaschange */
	public Body onhaschange(String value) {
		return this.attr("onhaschange", value);
	}

	public String onhaschange() {
		return attr("onhaschange");
	}
	
	/** DOMElement event onload */
	public Body onload(String value) {
		return this.attr("onload", value);
	}

	public String onload() {
		return attr("onload");
	}
	
	/** DOMElement event onmessage */
	public Body onmessage(String value) {
		return this.attr("onmessage", value);
	}

	public String onmessage() {
		return attr("onmessage");
	}
	
	/** DOMElement event onoffline */
	public Body onoffline(String value) {
		return this.attr("onoffline", value);
	}

	public String onoffline() {
		return attr("onoffline");
	}
	
	/** DOMElement event ononline */
	public Body ononline(String value) {
		return this.attr("ononline", value);
	}

	public String ononline() {
		return attr("ononline");
	}
	
	/** DOMElement event onpagehide */
	public Body onpagehide(String value) {
		return this.attr("onpagehide", value);
	}

	public String onpagehide() {
		return attr("onpagehide");
	}
	
	/** DOMElement event onpageshow */
	public Body onpageshow(String value) {
		return this.attr("onpageshow", value);
	}

	public String onpageshow() {
		return attr("onpageshow");
	}
	
	/** DOMElement event onpopstate */
	public Body onpopstate(String value) {
		return this.attr("onpopstate", value);
	}

	public String onpopstate() {
		return attr("onpopstate");
	}
	
	/** DOMElement event onredo */
	public Body onredo(String value) {
		return this.attr("onredo", value);
	}

	public String onredo() {
		return attr("onredo");
	}
	
	/** DOMElement event onresize */
	public Body onresize(String value) {
		return this.attr("onresize", value);
	}

	public String onresize() {
		return attr("onresize");
	}
	
	/** DOMElement event onstorage */
	public Body onstorage(String value) {
		return this.attr("onstorage", value);
	}

	public String onstorage() {
		return attr("onstorage");
	}
	
	/** DOMElement event onundo */
	public Body onundo(String value) {
		return this.attr("onundo", value);
	}

	public String onundo() {
		return attr("onundo");
	}
	
	/** DOMElement event onunload */
	public Body onunload(String value) {
		return this.attr("onunload", value);
	}

	public String onunload() {
		return attr("onunload");
	}
}

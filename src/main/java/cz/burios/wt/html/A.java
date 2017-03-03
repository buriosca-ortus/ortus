package cz.burios.wt.html;

import java.util.ArrayList;

import cz.burios.wt.Visitable;

public class A extends Tag<A> {

	//private static final long serialVersionUID = -6847896697415517095L;

	public enum rel {	
		alternate,	author,		bookmark,
		help,		license,	next,
		nofollow,	noreferrer,	prefetch,
		prev,		search,		tag	
	}
	
	public A() {
		super("a");
		children = new ArrayList<Visitable>();
		this.inst = this;
	}

	public A(String href) {
		this();
		href(href);
	}

	public A(Visitable content) {
		this();
		add(content);
	}

	public A(String href, String target) {
		this(href);
		if (target != null) {
			target(target);
		}
	}

	public A(String href, Visitable content) {
		this(href);
		add(content);
	}

	public A(String href, String target, Visitable content) {
		this(href, target);
		add(content);
	}

	public A(String href, String target, String content) {
		this(href, target);
		text(content);
	}

	public A(String href, String target, String content, String cssClass) {
		this(href, target);
		text(content);
		css(cssClass);
	}

	/** DOMElement attribute charset */
	public A charset(String value) {
		return this.attr("charset", value);
	}

	public String charset() {
		return this.attr("charset");
	}

	/** DOMElement attribute charset */
	public boolean removeCharset() {
		return removeAttribute("charset");
	}

	/** DOMElement attribute coords */
	public A coords(String value) {
		return this.attr("coords", value);
	}

	public String coords() {
		return this.attr("coords");
	}

	public boolean removeCoords() {
		return removeAttribute("coords");
	}

	/** DOMElement attribute href */
	public A href(String value) {
		return this.attr("href", value);
	}

	public String href() {
		return this.attr("href");
	}

	public boolean removeHref() {
		return removeAttribute("href");
	}

	/** DOMElement attribute hreflang */
	public A hreflang(String value) {
		return this.attr("hreflang", value);
	}

	public String hreflang() {
		return this.attr("hreflang");
	}

	public boolean removeHreflang() {
		return removeAttribute("hreflang");
	}

	/** DOMElement attribute name */
	public A name(String value) {
		return this.attr("name", value);
	}

	public String name() {
		return this.attr("name");
	}

	public boolean removeName() {
		return removeAttribute("name");
	}

	/** DOMElement attribute rel */
	public A rel(String value) {
		return this.attr("rel", value);
	}

	public String rel() {
		return this.attr("rel");
	}

	public boolean removeRel() {
		return removeAttribute("rel");
	}

	/** DOMElement attribute rev */
	public A rev(String value) {
		return this.attr("rev", value);
	}

	public String rev() {
		return this.attr("rev");
	}

	public boolean removeRev() {
		return removeAttribute("rev");
	}

	/** DOMElement attribute shape */
	public A shape(String value) {
		return this.attr("shape", value);
	}

	public String shape() {
		return this.attr("shape");
	}

	public boolean removeShape() {
		return removeAttribute("shape");
	}

	/** DOMElement attribute target */
	public A target(String value) {
		return this.attr("target", value);
	}

	public String target() {
		return this.attr("target");
	}

	public boolean removeTarget() {
		return removeAttribute("target");
	}

	/** DOMElement attribute type */
	public A type(String value) {
		return this.attr("type", value);
	}

	public String type() {
		return this.attr("type");
	}

	public boolean removeType() {
		return removeAttribute("type");
	}
	
	// ----- HTML5 ------------------------------------------------------------
	
	//download
	
	/** 
	 * DOMElement attribute download  
	 * 
	 * HTML5
	 * @param value
	 * @return
	 */
	public A download(String value) {
		return this.attr("download", value);
	}

	public String download() {
		return this.attr("download");
	}

	public boolean removeDownload() {
		return removeAttribute("download");
	}

	//media
	/**
	 * DOMElement attribute media
	 * 
	 * HTML5
	 * @param value
	 * @return
	 */
	public A media(String value) {
		return this.attr("media", value);
	}

	public String media() {
		return this.attr("media");
	}

	public boolean removeMedia() {
		return removeAttribute("media");
	}
}

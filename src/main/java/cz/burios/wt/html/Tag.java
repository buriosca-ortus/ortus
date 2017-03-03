package cz.burios.wt.html;

import cz.burios.wt.xml.Element;

public class Tag<T> extends Element<T> implements ITag<T> {

	public Tag(String name) {
		super(name);
	}

	@Override
	public T id(String value) {
		return this.attr("id", value);
	}

	@Override
	public String id() {
		return attr("id");
	}

	@Override
	public T css(String value) {
		return this.attr("class", value);
	}

	@Override
	public String css() {
		return attr("class");
	}

	@Override
	public T title(String value) {
		return this.attr("title", value);
	}

	@Override
	public String title() {
		return attr("title");
	}

	@Override
	public T style(String value) {
		return this.attr("style", value);
	}

	@Override
	public String style() {
		return attr("style");
	}

	@Override
	public T dir(String value) {
		return this.attr("dir", value);
	}

	@Override
	public String dir() {
		return attr("dir");
	}

	@Override
	public T lang(String value) {
		return this.attr("lang", value);
	}

	@Override
	public String lang() {
		return attr("lang");
	}

	@Override
	public T xmlLang(String value) {
		return this.attr("xml:lang", value);
	}

	@Override
	public String xmlLang() {
		return attr("xml:lang");
	}

	@Override
	public T data(String suffix, String value) {
		return this.attr("data-"+suffix, value);
	}

	@Override
	public String data(String suffix) {
		return attr("data-"+suffix);
	}

	/* ----- Events ----- */
	
	@Override
	public T onclick(String value) {
		return this.attr("onclick", value);
	}

	@Override
	public String onclick() {
		return attr("onclick");
	}

}

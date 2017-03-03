package cz.burios.wt.html;

import java.util.ArrayList;

import cz.burios.wt.Visitable;

public class Form extends Tag<Form> {

	public enum target { _blank, _self, _parent, _top, }
	
	public Form() {
		super("form");
		this.inst = this;
		children = new ArrayList<Visitable>();
	}

	public Form(String action) {
		this();
		action(action);
	}

	public Form action(String value) {
		attr("action", value);
		return this;
	}

	public String action() {
		return attr("action");
	}

	public boolean removeAction() {
		return removeAttribute("action");
	}

	public Form accept(String value) {
		attr("accept", value);
		return this;
	}

	public String accept() {
		return attr("accept");
	}

	public boolean removeAccept() {
		return removeAttribute("accept");
	}

	public Form acceptCharset(String value) {
		attr("accept-charset", value);
		return this;
	}

	public String acceptCharset() {
		return attr("accept-charset");
	}

	public boolean removeAcceptCharset() {
		return removeAttribute("accept-charset");
	}

	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Form autocomplete(boolean value) {
		attr("autocomplete", ((value) ? "on" : "off"));
		return this;
	}

	public String autocomplete() {
		return attr("autocomplete");
	}

	public boolean removeAutocomplete() {
		return removeAttribute("autocomplete");
	}
	
	public Form enctype(String value) {
		attr("enctype", value);
		return this;
	}

	public String enctype() {
		return attr("enctype");
	}

	public boolean removeEnctype() {
		return removeAttribute("enctype");
	}

	public Form method(String value) {
		attr("method", value);
		return this;
	}

	public String method() {
		return attr("method");
	}

	public boolean removeMethod() {
		return removeAttribute("method");
	}

	public Form name(String value) {
		attr("name", value);
		return this;
	}

	public String name() {
		return attr("name");
	}

	public boolean removeName() {
		return removeAttribute("name");
	}

	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Form novalidate(String value) {
		attr("novalidate", value);
		return this;
	}

	public String novalidate() {
		return attr("novalidate");
	}

	public boolean removeNovalidate() {
		return removeAttribute("novalidate");
	}

	public Form target(String value) {
		attr("target", value);
		return this;
	}
	
	public Form target(Form.target value) {
		attr("target", value.name());
		return this;
	}

	public String target() {
		return attr("target");
	}

	public boolean removeTarget() {
		return removeAttribute("target");
	}
}

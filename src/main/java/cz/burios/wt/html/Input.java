package cz.burios.wt.html;

public class Input extends Tag<Input> {

	public enum type {
		button,	checkbox,	color, 	date,	datetime,	//datetime-local, 
		email, 	file,		hidden, image,	month,
		number,	password,	radio,	range,	reset,
		search,	submit,		tel,	text,	time,
		url,	week	
	}
	
	public Input() {
		super("input");
	}
	
	public Input accept(String value) {
		attr("accept", value);
		return this;
	}

	public String accept() {
		return attr("accept");
	}

	public boolean removeAccept() {
		return removeAttribute("accept");
	}

	public Input align(String value) {
		attr("align", value);
		return this;
	}

	public String align() {
		return attr("align");
	}

	public boolean removeAlign() {
		return removeAttribute("align");
	}

	public Input alt(String value) {
		attr("alt", value);
		return this;
	}

	public String alt() {
		return attr("alt");
	}

	public boolean removeAlt() {
		return removeAttribute("alt");
	}

	public Input checked(String value) {
		attr("checked", value);
		return this;
	}

	public String checked() {
		return attr("checked");
	}

	public boolean removeChecked() {
		return removeAttribute("checked");
	}

	public Input disabled(String value) {
		attr("disabled", value);
		return this;
	}

	public String disabled() {
		return attr("disabled");
	}

	public boolean removeDisabled() {
		return removeAttribute("disabled");
	}

	public Input maxlength(String value) {
		attr("maxlength", value);
		return this;
	}

	public String maxlength() {
		return attr("maxlength");
	}

	public boolean removeMaxlength() {
		return removeAttribute("maxlength");
	}

	public Input name(String value) {
		attr("name", value);
		return this;
	}

	public String name() {
		return attr("name");
	}

	public boolean removeName() {
		return removeAttribute("name");
	}

	public Input readonly(String value) {
		attr("readonly", value);
		return this;
	}

	public String readonly() {
		return attr("readonly");
	}

	public boolean removeReadonly() {
		return removeAttribute("readonly");
	}

	public Input size(String value) {
		attr("size", value);
		return this;
	}

	public String size() {
		return attr("size");
	}

	public boolean removeSize() {
		return removeAttribute("size");
	}

	public Input src(String value) {
		attr("src", value);
		return this;
	}

	public String src() {
		return attr("src");
	}

	public boolean removeSrc() {
		return removeAttribute("src");
	}

	public Input type(String value) {
		attr("type", value);
		return this;
	}

	public String type() {
		return attr("type");
	}

	public boolean removeType() {
		return removeAttribute("type");
	}

	public Input value(String value) {
		attr("value", value);
		return this;
	}

	public String value() {
		return attr("value");
	}

	public boolean removeValue() {
		return removeAttribute("value");
	}

	// ----- HTML5 ------------------------------------------------------------
	
	//autocomplete
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input autocomplete(String value) {
		attr("autocomplete", value);
		return this;
	}

	public String autocomplete() {
		return attr("autocomplete");
	}

	public boolean removeAutocomplete() {
		return removeAttribute("autocomplete");
	}

	//autofocus
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input autofocus(String value) {
		attr("autofocus", value);
		return this;
	}

	public String autofocus() {
		return attr("autofocus");
	}

	public boolean removeAutofocus() {
		return removeAttribute("autofocus");
	}

	//form
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input form(String value) {
		attr("form", value);
		return this;
	}

	public String form() {
		return attr("form");
	}

	public boolean removeForm() {
		return removeAttribute("form");
	}

	//formaction
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input formaction(String value) {
		attr("formaction", value);
		return this;
	}

	public String formaction() {
		return attr("formaction");
	}

	public boolean removeFormaction() {
		return removeAttribute("formaction");
	}

	//formenctype
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input formenctype(String value) {
		attr("formenctype", value);
		return this;
	}

	public String formenctype() {
		return attr("formenctype");
	}

	public boolean removeFormenctype() {
		return removeAttribute("formenctype");
	}

	//formmethod
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input formmethod(String value) {
		attr("formmethod", value);
		return this;
	}

	public String formmethod() {
		return attr("formmethod");
	}

	public boolean removeFormmethod() {
		return removeAttribute("formmethod");
	}

	//formnovalidate
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input formnovalidate(String value) {
		attr("formnovalidate", value);
		return this;
	}

	public String formnovalidate() {
		return attr("formnovalidate");
	}

	public boolean removeFormnovalidate() {
		return removeAttribute("formnovalidate");
	}

	//formtarget
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input formtarget(String value) {
		attr("formtarget", value);
		return this;
	}

	public String formtarget() {
		return attr("formtarget");
	}

	public boolean removeFormtarget() {
		return removeAttribute("formtarget");
	}

	//framename
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input framename(String value) {
		attr("framename", value);
		return this;
	}

	public String framename() {
		return attr("framename");
	}

	public boolean removeFramename() {
		return removeAttribute("framename");
	}

	//height
	/**
	 * HTML5
	 * @param value
	 * @return
	 */	
	public Input height(String value) {
		attr("height", value);
		return this;
	}

	public String height() {
		return attr("height");
	}

	public boolean removeHeight() {
		return removeAttribute("height");
	}

	//list
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input list(String value) {
		attr("list", value);
		return this;
	}

	public String list() {
		return attr("list");
	}

	public boolean removeList() {
		return removeAttribute("list");
	}

	//max
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input max(String value) {
		attr("max", value);
		return this;
	}

	public String max() {
		return attr("max");
	}

	public boolean removeMax() {
		return removeAttribute("max");
	}

	//min
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input min(String value) {
		attr("min", value);
		return this;
	}

	public String min() {
		return attr("min");
	}

	public boolean removeMin() {
		return removeAttribute("min");
	}

	//multiple
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input multiple(String value) {
		attr("multiple", value);
		return this;
	}

	public String multiple() {
		return attr("multiple");
	}

	public boolean removeMultiple() {
		return removeAttribute("multiple");
	}

	//pattern
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input pattern(String value) {
		attr("pattern", value);
		return this;
	}

	public String pattern() {
		return attr("pattern");
	}

	public boolean removePattern() {
		return removeAttribute("pattern");
	}

	//placeholder
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input placeholder(String value) {
		attr("placeholder", value);
		return this;
	}

	public String placeholder() {
		return attr("placeholder");
	}

	public boolean removePlaceholder() {
		return removeAttribute("placeholder");
	}

	//required
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input required(String value) {
		attr("required", value);
		return this;
	}

	public String required() {
		return attr("required");
	}

	public boolean removeRequired() {
		return removeAttribute("required");
	}

	//step
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input step(String value) {
		attr("step", value);
		return this;
	}

	public String step() {
		return attr("step");
	}

	public boolean removeStep() {
		return removeAttribute("step");
	}

	//width
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public Input width(String value) {
		attr("width", value);
		return this;
	}

	public String width() {
		return attr("width");
	}

	public boolean removeWidth() {
		return removeAttribute("width");
	}


}

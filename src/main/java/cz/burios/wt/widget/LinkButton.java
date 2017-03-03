package cz.burios.wt.widget;

import cz.burios.wt.html.A;

/**
 * LinkButton
 * 
 * Override defaults with $.fn.linkbutton.defaults.
 * 
 * The linkbutton is used to create a hyperlink button. It is a representation of a normal <a> tag. It can display both an icon and text, or only the icon or text. The button width can dynamic and shrink/expand to fit its text labels.
 * 
 * 
 * Usage Example
 * Create linkbutton
 * 
 * Create a linkbutton from markup is more easily.
 * 
 * <a id="btn" href="#" class="nestui-linkbutton" data-options="iconCls:'icon-search'">nestui</a>
 * Create a linkbutton programmatically is also allowed.
 * 
 * <a id="btn" href="#">nestui</a>
 * $('#btn').linkbutton({
 *     iconCls: 'icon-search'
 * });
 * Process clicking on linkbutton.
 * 
 * Clicking on linkbutton will send the user to other page.
 * 
 * <a href="otherpage.php" class="nestui-linkbutton" data-options="iconCls:'icon-search'">nestui</a>
 * The example below will alert a message.
 * 
 * <a href="#" class="nestui-linkbutton" data-options="iconCls:'icon-search'" onclick="javascript:alert('nestui')">nestui</a>
 * Bind click handler using jQuery.
 * 
 * <a id="btn" href="#" class="nestui-linkbutton" data-options="iconCls:'icon-search'">nestui</a>
 * $(function(){
 *     $('#btn').bind('click', function(){
 *         alert('nestui');
 *     });
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class LinkButton extends Widget<A> {

	public LinkButton() {
		super(new A(), Widget.createOptions(WidgetClass.linkbutton));
	}

	public LinkButton(String id, WidgetDefs opts) {
		super(new A().id(id).href("javascript:void(0)"), opts);
	}

	/* -----  ----- */
	
	@Override
	public LinkButton id(String value) {
		return (LinkButton) super.id(value);
	}

	@Override
	public LinkButton css(String value) {
		this.tag.css(value);
		return this; 
	}

	@Override
	public LinkButton title(String value) {
		this.tag.title(value);
		return this;
	}

	@Override
	public LinkButton style(String value) {
		this.tag.style(value);
		return this;
	}

	@Override
	public LinkButton dir(String value) {
		this.tag.dir(value);
		return this;
	}

	@Override
	public LinkButton lang(String value) {
		this.tag.lang(value);
		return this;
	}

	@Override
	public LinkButton xmlLang(String value) {
		this.tag.xmlLang(value);
		return this;
	}

	/* -----  ----- */
	
	public LinkButton charset(String value) {
		this.tag.attr("charset", value);
		return this;
	}

	public String charset() {
		return this.tag.attr("charset");
	}

	public LinkButton coords(String value) {
		this.tag.attr("coords", value);
		return this;
	}

	public String coords() {
		return this.tag.attr("coords");
	}

	public LinkButton href(String value) {
		this.tag.attr("href", value);
		return this;
	}

	public String href() {
		return this.tag.attr("href");
	}

	public LinkButton hreflang(String value) {
		setAttribute("hreflang", value);
		return this;
	}

	public String hreflang() {
		return this.tag.attr("hreflang");
	}

	public LinkButton name(String value) {
		this.tag.attr("name", value);
		return this;
	}

	public String name() {
		return this.tag.attr("name");
	}

	public LinkButton rel(String value) {
		this.tag.attr("rel", value);
		return this;
	}

	public String rel() {
		return this.tag.attr("rel");
	}

	public LinkButton rev(String value) {
		this.tag.attr("rev", value);
		return this;
	}

	public String rev() {
		return this.tag.attr("rev");
	}

	public LinkButton shape(String value) {
		this.tag.attr("shape", value);
		return this;
	}

	public String shape() {
		return this.tag.attr("shape");
	}

	public LinkButton target(String value) {
		this.tag.attr("target", value);
		return this;
	}

	public String target() {
		return this.tag.attr("target");
	}

	public LinkButton type(String value) {
		this.tag.attr("type", value);
		return this;
	}

	public String type() {
		return this.tag.attr("type");
	}

	// ----- HTML5 ------------------------------------------------------------
	
	//download
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public LinkButton download(String value) {
		this.tag.attr("download", value);
		return this;
	}

	public String download() {
		return this.tag.attr("download");
	}

	//media
	/**
	 * HTML5
	 * @param value
	 * @return
	 */
	public LinkButton media(String value) {
		this.tag.attr("media", value);
		return this;
	}

	public String media() {
		return this.tag.attr("media");
	}

}

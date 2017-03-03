package cz.burios.wt.html;

public class Meta extends Tag<Meta> {

	//private static final long serialVersionUID = 5176509113340340977L;

	public Meta() {
		super("meta");
		this.inst = this;
	}

	public Meta(String content) {
		this();
		content(content);
	}

	public Meta content(String value) {
		attr("content", value);
		return this;
	}

	public String content() {
		return attr("content");
	}

	/**
	 * Pripustne hodnoty: <br>
	 * 	- content-type <br>
	 *  - default-style <br>
	 *  - refresh <br>
	 *  
	 * @param value
	 * @return
	 */
	public Meta httpEquiv(String value) {
		attr("http-equiv", value);
		return this;
	}

	public String httpEquiv() {
		return attr("http-equiv");
	}
	
	/**
	 * Pripustne hodnoty: <br>
	 * 	- application-name <br>
	 * 	- author <br>
	 * 	- description <br>
	 * 	- generator <br>
	 * 	- keywords <br>
	 * 
	 * @param value
	 * @return
	 */
	public Meta name(String value) {
		attr("name", value);
		return this;
	}

	public String name() {
		return attr("name");
	}
	
	public Meta scheme(String value) {
		attr("scheme", value);
		return this;
	}

	public String scheme() {
		return attr("scheme");
	}

	/* ----- HTML5 ----- */
	
	
	public Meta charset(String value) {
		attr("charset", value);
		return this;
	}

	public String charset() {
		return attr("charset");
	}

}

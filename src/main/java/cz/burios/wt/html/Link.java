package cz.burios.wt.html;

public class Link extends Tag<Link> {

	public Link() {
		super("link");
		this.inst = this;
	}

	public Link charset(String value) {
		attr("charset", value);
		return this;
	}

	public String charset() {
		return attr("charset");
	}

	public Link href(String value) {
		attr("href", value);
		return this;
	}

	public String href() {
		return attr("href");
	}

	public Link hreflang(String value) {
		attr("hreflang", value);
		return this;
	}

	public String hreflang() {
		return attr("hreflang");
	}

	public Link media(String value) {
		attr("media", value);
		return this;
	}

	public String media() {
		return attr("media");
	}

	/**
	 * Pripustne hodnoty: <br>
	 *  - alternate <br>
	 *  - archives <br>
	 *  - author <br>
	 *  - bookmark <br>
	 *  - external <br>
	 *  - first <br>
	 *  - help <br>
	 *  - icon <br>
	 *  - last <br>
	 *  - license <br>
	 *  - next <br>
	 *  - nofollow <br>
	 *  - noreferrer <br>
	 *  - pingback <br>
	 *  - prefetch <br>
	 *  - prev <br>
	 *  - search <br>
	 *  - sidebar <br>
	 *  - stylesheet <br>
	 *  - tag <br>
	 *  - up <br>
	 *  
	 * @param value
	 * @return
	 */
	public Link rel(String value) {
		attr("rel", value);
		return this;
	}

	public String rel() {
		return attr("rel");
	}

	public Link rev(String value) {
		attr("rev", value);
		return this;
	}

	public String rev() {
		return attr("rev");
	}

	/**
	 * 
	 * @param value
	 * @return
	 */
	public Link target(String value) {
		attr("target", value);
		return this;
	}

	public String target() {
		return attr("target");
	}

	public Link type(String value) {
		attr("type", value);
		return this;
	}

	public String type() {
		return attr("type");
	}

	/* ----- Html5 ----- */
	
	// crossorigin
	// sizes
}

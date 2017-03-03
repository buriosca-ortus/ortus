package cz.burios.wt.html;

public class Tags {

	public static enum align {
		left, right, center
	}
	public static enum valign {
		top, middle, bottom
	}
	
	public static A a() { return new A(); }
	//public static Abbr abbr() { return new Abbr(); }
	//public static Acronym acronym() { return new Acronym(); }
	//public static Address address() { return new Address(); }
	//public static Area area() { return new Area(); }
	//public static Audio audio() { return new Audio(); }
	//public static B b() { return new B(); }
	//public static Base base(String href) { return new Base(href); }
	//public static Bdo bdo(String dir) { return new Bdo(dir); }
	//public static Big big() { return new Big(); }
	//public static Blockquote blockquote() { return new Blockquote(); }
	public static Body body() { return new Body(); }
	public static Br br() { return new Br(); }
	//public static Button button() { return new Button(); }
	//public static Canvas canvas() { return new Canvas(); }
	//public static Caption caption() { return new Caption(); }
	//public static Center center() { return new Center(); }
	//public static Cite cite() { return new Cite(); }
	//public static Code code() { return new Code(); }
	//public static Col col() { return new Col(); }
	//public static Colgroup colgroup() { return new Colgroup(); }
	/*
	public static Comment comment() { return new Comment(); }
	public static Datalist datalist() { return new Datalist(); }
	public static Dd dd() { return new Dd(); }
	public static Del del() { return new Del(); }
	public static Dfn dfn() { return new Dfn(); }
	public static Dir dir() { return new Dir(); }
	*/
	public static Div div() { return new Div(); }
	//public static Dl dl() { return new Dl(); }
	public static Doctype doctype() { return new Doctype(); }
	public static Document document() { return new Document(); }
	/*
	public static Dt dt() { return new Dt(); }
	public static Em em() { return new Em(); }
	public static Embed embed() { return new Embed(); }
	public static Fieldset fieldset() { return new Fieldset(); }
	public static Figcaption figcaption() { return new Figcaption(); }
	public static Figure figure() { return new Figure(); }
	public static Font font() { return new Font(); }
	public static Footer footer() { return new Footer(); }
	*/
	public static Form form() { return new Form(); }
	public static Form form(String action) { return new Form(action); }
	/*
	public static Frame frame() { return new Frame(); }
	public static Frameset frameset() { return new Frameset(); }
	public static H1 H1() { return new H1(); }
	public static H2 H2() { return new H2(); }
	public static H3 H3() { return new H3(); }
	public static H4 H4() { return new H4(); }
	public static H5 H5() { return new H5(); }
	public static H6 H6() { return new H6(); }
	*/
	public static Head head() { return new Head(); }
	//public static Header header() { return new Header(); }
	//public static Hr hr() { return new Hr(); }
	public static Html html() { return new Html(); }
	/*
	public static I i() { return new I(); }
	public static Iframe iframe() { return new Iframe(); }
	public static Img img() { return new Img(); }
	public static Img img(String src) { return new Img(src); }
	public static Img img(String alt, String src) { return new Img(alt, src); }
	 */
	public static Input input() { return new Input(); }
	//public static Ins ins() { return new Ins(); }
	public static JavaScript javaScript() { return new JavaScript(); }
	public static JavaScript javaScript(String src) { return new JavaScript(src); }
	/*
	public static Kbd kbd() { return new Kbd(); }
	public static Label label() { return new Label(); }
	public static Legend legend() { return new Legend(); }
	public static Li li() { return new Li(); }
	 */ 
	public static Link link() { return new Link(); }
	// $ public static Main main() { return new Main(); }
	// $ public static Map map(String id) { return new Map(id); }
	// $ public static Mark mark() { return new Mark(); }
	public static Meta meta(String content) { return new Meta(content); }
	/*
	public static Nav nav() { return new Nav(); }
	public static Noframes noframes() { return new Noframes(); }
	public static Noscript noscript() { return new Noscript(); }
	// $ public static Object object() { return new Object(); }
	public static Ol ol() { return new Ol(); }
	public static Optgroup optgroup(String label) { return new Optgroup(label); }
	public static Option option() { return new Option(); }
	public static P p() { return new P(); }
	//public static Param param(String name) { return new Param(name); }
	//public static Pre pre() { return new Pre(); }
	// $ public static Progress progress() { return new Progress(); }
	//public static Q q() { return new Q(); }
	//public static S s() { return new S(); }
	//public static Samp samp() { return new Samp(); }
	*/
	public static Script script(String type) { return new Script(type); }
	/*
	public static Select select() { return new Select(); }
	public static Small small() { return new Small(); }
	public static Source source() { return new Source(); }
	public static Span span() { return new Span(); }
	public static Strike strike() { return new Strike(); }
	public static Strong strong() { return new Strong(); }
	*/
	public static Style style(String type) { return new Style(type); }
	/*
	public static Sub sub() { return new Sub(); }
	public static Sup sup() { return new Sup(); }
	public static Table table() { return new Table(); }
	public static Tbody tbody() { return new Tbody(); }
	public static Td td() { return new Td(); }
	public static Text text(String text) { return new Text(text); }
	public static Textarea textarea(String cols, String rows) { return new Textarea(cols, rows); }
	public static Tfoot tfoot() { return new Tfoot(); }
	public static Th th() { return new Th(); }
	public static Thead thead() { return new Thead(); }
	public static Time time() { return new Time(); }
	*/
	public static Title title() { return new Title(); }
	/*
	public static Tr tr() { return new Tr(); }
	public static Tt tt() { return new Tt(); }
	public static U u() { return new U(); }
	public static Ul ul() { return new Ul(); }
	public static Var var() { return new Var(); }
	*/
}

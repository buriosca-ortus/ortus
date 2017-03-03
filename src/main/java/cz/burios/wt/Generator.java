package cz.burios.wt;

import java.io.StringWriter;

import cz.burios.wt.xml.Element;

public class Generator implements CodeVisitor {

	public final static String CRLF = "\r\n";
	public final static String LF = "\n";
	/** znak tabulátor */
	public final static String TAB = "\t";
	
	/** znak mezera */
	public final static String SPACE = " ";
	/** znak čárka */
	public final static String COMMA = ",";
	/** znak tředník */
	public final static String SEMICOLON = ";";
	/** znak dvojtečka */
	public final static String COLON = ":";
	/** znak lomítko */
	public final static String SLASH = "/";
	/** znak dvojitá uvozovka */
	public final static String QUOT = "\"";
	
	/** znak rovná se */
	public final static String EQ = "=";
	/** znak špičatá závorka levá */
	public final static String LT = "<";
	/** znak špičatá závorka pravá */
	public final static String GT = ">";
	/** znak ampersand */
	public final static String AMP = "&";
	/** znak mříž */
	public final static String NET = "#";
	
	protected Appendable out;
	
	public Generator() {
		out = new StringWriter();
	}

	public Generator(Appendable writer) {
		this.out = writer;
	}

	@Override
	public void visit(Element<?> node, CodeVisitor visitor) throws Exception {
		node.accept(this);
	}

	@Override
	public Appendable out() {
		return this.out;
	}
	
}

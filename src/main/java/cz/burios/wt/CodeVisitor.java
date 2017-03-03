package cz.burios.wt;

import cz.burios.wt.xml.Element;

public interface CodeVisitor {
	
	public Appendable out();
	
	public void visit(Element<?> node, CodeVisitor visitor) throws Exception;
}

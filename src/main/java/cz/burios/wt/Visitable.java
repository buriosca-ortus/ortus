package cz.burios.wt;

public interface Visitable {

	public void accept(CodeVisitor visitor);
}

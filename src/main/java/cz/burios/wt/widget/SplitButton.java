package cz.burios.wt.widget;

import cz.burios.wt.html.A;

/**
 * SplitButton
 * 
 * Extend from $.fn.linkbutton.defaults. Override defaults with $.fn.splitbutton.defaults.
 * 
 * Simalar to the menubutton, the splitbutton is also associated with linkbutton and menu. The difference between menubutton and splitbutton is that the splitbutton is split into two parts. When moving mouse over the splitbutton, a 'split' line will display. The menu only display when moving mouse over the right part of splitbutton.
 * 
 * 
 * Dependencies
 * 		- menubutton
 * 
 * Usage
 * Create splitbutton from markup.
 * 
 * <a href="javascript:void(0)" id="sb" class="easyui-splitbutton" data-options="menu:'#mm',iconCls:'icon-ok'" onclick="javascript:alert('ok')">Ok</a>
 * <div id="mm" style="width:100px;">
 *     <div data-options="iconCls:'icon-ok'">Ok</div>
 *     <div data-options="iconCls:'icon-cancel'">Cancel</div>
 * </div>
 * Create splitbutton using javascript.
 * 
 * <a href="javascript:void(0)" id="sb" onclick="javascript:alert('ok')">Ok</a>
 * <div id="mm" style="width:100px;">
 * ...
 * </div>
 * $('#sb').splitbutton({
 *     iconCls: 'icon-ok',
 *     menu: '#mm'
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class SplitButton extends Widget<A> {

	public SplitButton(String id, WidgetDefs options) {
		super(new A().id(id).href("javascript:void(0)"), options);
	}

	public SplitButtonDefs opts() {
		return (SplitButtonDefs) this.opts();
	}
	
}

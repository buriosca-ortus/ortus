package cz.burios.wt.widget;

import cz.burios.wt.html.A;

/**
 * MenuButton
 * 
 * Extend from $.fn.linkbutton.defaults. Override defaults with $.fn.menubutton.defaults.
 * 
 * The menubutton is the part of drop-down menu. It is associated with a linkbutton and menu. The linkbutton is displayed while the menu is hidden. When users click or move the mouse over the linkbutton, the menu will show to allow to click on it.
 * 
 * Dependencies:
 * 		- menu
 * 		- linkbutton
 * 
 * Usage
 * Usually the menubutton is created declaratively from markup.
 * 
 * <a href="javascript:void(0)" id="mb" class="nestui-menubutton" data-options="menu:'#mm',iconCls:'icon-edit'">Edit</a>
 * <div id="mm" style="width:150px;">
 *     <div data-options="iconCls:'icon-undo'">Undo</div>
 *     <div data-options="iconCls:'icon-redo'">Redo</div>
 *     <div class="menu-sep"></div>
 *     <div>Cut</div>
 *     <div>Copy</div>
 *     <div>Paste</div>
 *     <div class="menu-sep"></div>
 *     <div data-options="iconCls:'icon-remove'">Delete</div>
 *     <div>Select All</div>
 * </div>
 * Create menubutton using javascript.

 * <a href="javascript:void(0)" id="mb">Edit</a>
 * <div id="mm" style="width:150px">
 * ...
 * </div>
 * $('#mb').menubutton({
 *     iconCls: 'icon-edit',
 *     menu: '#mm'
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class MenuButton extends Widget<A> {

	public MenuButton(WidgetDefs options) {
		super(null, options);
	}

}

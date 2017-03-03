package cz.burios.wt.widget;

/**
 * Menu
 * 
 * Override defaults with $.fn.menu.defaults.
 * 
 * The menu is usually used for context menus. It is the base component for building other menu component such as menubutton and splitbutton. It also can be used for both navigation and executing commands.
 * 
 * Usage Example
 * Create Menu
 * 
 * Create menu via markup should add 'nestui-menu' class to <div/> markup. Each menu item is created via <div/> markup. We can add 'iconCls' attribute to menu item to define a icon that will display on left of menu item. Add 'menu-sep' class to menu item will generate a menu seperator.
 * 
 * <div id="mm" class="nestui-menu" style="width:120px;">
 *     <div>New</div>
 *     <div>
 *         <span>Open</span>
 *         <div style="width:150px;">
 *             <div><b>Word</b></div>
 *             <div>Excel</div>
 *             <div>PowerPoint</div>
 *         </div>
 *     </div>
 *     <div data-options="iconCls:'icon-save'">Save</div>
 *     <div class="menu-sep"></div>
 *     <div>Exit</div>
 * </div>
 * Create menu programatically and listening the 'onClick' event.
 * 
 * $('#mm').menu({
 *     onClick:function(item){
 *         //...
 *     }
 * });
 * 
 * Show Menu
 * 
 * When menu is created, it's hidden and not visible. Call 'show' method to display menu.
 * 
 * $('#mm').menu('show', {
 *     left: 200,
 *     top: 100
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class Menu {

}

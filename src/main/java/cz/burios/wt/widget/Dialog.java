package cz.burios.wt.widget;

/**
 * Dialog
 * 
 * Extend from $.fn.window.defaults. Override defaults with $.fn.dialog.defaults.
 * 
 * The dialog is a special type of window, which can has a toolbar on top and a button bar on bottom. The dialog has only one close tool display on top right of header by default. Users can configure dialog behaviors to display other tools such as collapsible, minimizable, maximizable tool, etc.
 * 
 * 
 * Dependencies:
 * 		- window
 * 		- linkbutton
 * 
 * Usage
 * Create dialog via markup from an existing DOM node. The example below shows a modal dialog with resizable feature.
 * 
 * <div id="dd" class="nestui-dialog" title="My Dialog" style="width:400px;height:200px;" data-options="iconCls:'icon-save',resizable:true,modal:true">
 *     Dialog Content.
 * </div>
 * Creating dialog using javascript is also allowed. Now let's create a modal dialog and then call 'refresh' method to load its content via ajax.
 * 
 * <div id="dd">Dialog Content.</div>
 * $('#dd').dialog({
 *     title: 'My Dialog',
 *     width: 400,
 *     height: 200,
 *     closed: false,
 *     cache: false,
 *     href: 'get_content.php',
 *     modal: true
 * });
 * $('#dd').dialog('refresh', 'new_content.php');
 * 
 * @author Buriosca.cz
 *
 */
public class Dialog {

}

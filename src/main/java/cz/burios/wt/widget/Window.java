package cz.burios.wt.widget;

/**
 * Window
 * 
 * Extend from $.fn.panel.defaults. Override defaults with $.fn.window.defaults.
 * 
 * The window is a floated and draggable panel that can be used as an application window. 
 * By default a window can be moved, resized and closed. 
 * Its content can also be defined with either as static html or loaded dynamically via ajax.
 * 
 * Dependencies:
 * 		- draggable
 * 		- resizable
 * 		- panel
 * 
 * Usage Example
 * Create Window
 * 
 * 1. Create window from markup.
 * 
 * <div id="win" class="nestui-window" title="My Window" style="width:600px;height:400px" data-options="iconCls:'icon-save',modal:true">
 * 		Window Content
 * </div>
 * 
 * 2. Create window using javascript.
 * 
 * <div id="win"></div>
 * $('#win').window({
 * 		width:600,
 * 		height:400,
 * 		modal:true
 * });
 * 
 * 3. Create window with complext layout.
 * 
 * As usual you can define the window layout. The example below shows how to split window area into two parts: the north and center.
 * 
 * <div id="win" class="nestui-window" title="My Window" style="width:600px;height:400px" data-options="iconCls:'icon-save',modal:true">
 * 		<div class="nestui-layout" data-options="fit:true">
 * 			<div data-options="region:'north',split:true" style="height:100px"></div>
 * 			<div data-options="region:'center'">
 * 				The Content.
 * 			</div>
 * 		</div>
 * </div>
 * Some actions with window
 * 
 * Open and close window.
 * $('#win').window('open');  // open a window
 * $('#win').window('close');  // close a window
 * 
 * Load window content via ajax.
 * 
 * $('#win').window('refresh', 'get_content.php');
 * 
 * 
 * @author Buriosca.cz
 *
 */
public class Window {

}

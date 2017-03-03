package cz.burios.wt.widget;

/**
 * Panel
 * 
 * Override defaults with $.fn.panel.defaults.
 * 
 * The panel is used as a container for other contents. It is the base component for building other components such as layout, tabs, accordion, etc. It also provides built-in collapsible, closable, maximizable and minimizable behavior and other customized behavior. Panels can be easily embedded into any position of web page.
 * 
 * 
 * Usage Example
 * Create Panel
 * 
 * 1. Create Panel via markup
 * 
 * Creation from markup is even easier. Add 'nestui-panel' class to <div/> markup.
 * 
 * <div id="p" class="nestui-panel" title="My Panel"  
 *         style="width:500px;height:150px;padding:10px;background:#fafafa;"
 *         data-options="iconCls:'icon-save',closable:true,
 *                 collapsible:true,minimizable:true,maximizable:true">
 *     <p>panel content.</p>
 *     <p>panel content.</p>
 * </div>
 * 2. Create Panel programatically
 * 
 * Let's create panel with tools on top right.
 * 
 * <div id="p" style="padding:10px;">
 *     <p>panel content.</p>
 *     <p>panel content.</p>
 * </div>
  * 
 * $('#p').panel({
 *     width:500,
 *     height:150,
 *     title:'My Panel',
 *     tools:[{
 *         iconCls:'icon-add',
 *         handler:function(){alert('new')}
 *     },{
 *         iconCls:'icon-save',
 *         handler:function(){alert('save')}
 *     }]
 * }); 
 * Move Panel
 * 
 * Call 'move' method to move panel to a new position
 * 
 * $('#p').panel('move',{
 *     left:100,
 *     top:100
 * });    
 * Load Content
 * 
 * Let's load the panel content via ajax and show some message when loaded successfully.
 * 
 * $('#p').panel({
 *     href:'content_url.php',
 *     onLoad:function(){
 *         alert('loaded successfully');
 *     }
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class Panel {

}

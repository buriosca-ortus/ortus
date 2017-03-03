package cz.burios.wt.widget;

/**
 * Accordion
 * 
 * Override defaults with $.fn.accordion.defaults.
 * 
 * The accordion allows you to provide multiple panels and display one or more at a time. Each panel has built-in support for expanding and collapsing. Clicking on a panel header to expand or collapse that panel body. The panel content can be loaded via ajax by specifying a 'href' property. Users can define a panel to be selected. If it is not specified, then the first panel is taken by default.
 * 
 * 
 * Dependencies:
 * 		- panel
 * 
 * Usage Example
 * Create Accordion
 * 
 * Create accordion via markup, add 'nestui-accordion' class to <div/> markup.
 * 
 * <div id="aa" class="nestui-accordion" style="width:300px;height:200px;">
 *     <div title="Title1" data-options="iconCls:'icon-save'" style="overflow:auto;padding:10px;">
 *         <h3 style="color:#0099FF;">Accordion for jQuery</h3>
 *         <p>Accordion is a part of nestui framework for jQuery. 
 *         It lets you define your accordion component on web page more easily.</p>
 *     </div>
 *     <div title="Title2" data-options="iconCls:'icon-reload',selected:true" style="padding:10px;">
 *         content2
 *     </div>
 *     <div title="Title3">
 *         content3
 *     </div>
 * </div>
 * We can change or recreate accordion later and modify some features.
 * 
 * $('#aa').accordion({
 *     animate:false
 * });
 * 
 * Refresh Accordion Panel Content
 * 
 * Call 'getSelected' method to get the current panel and then we can call 'refresh' method of panel to load new content.
 * 
 * var pp = $('#aa').accordion('getSelected');    // get the selected panel
 * if (pp){
 *     pp.panel('refresh','new_content.php');    // call 'refresh' method to load new content
 * }
 * 
 * @author Buriosca.cz
 *
 */
public class Accordion {

}

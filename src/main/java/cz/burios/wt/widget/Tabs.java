package cz.burios.wt.widget;

/**
 * Tabs
 * 
 * Override defaults with $.fn.tabs.defaults.
 * 
 * The tabs display a collection of panel. It shows only one tab panel at a time. Each tab panel has the header title and some mini button tools, including close button and other customized buttons.
 * 
 * 
 * Dependencies:
 * 		- panel
 * 		- linkbutton
 * 
 * Usage Example
 * Create tabs
 * 
 * 1. Create tabs via markup
 * 
 * Create tabs from markup is even easier, we don't need to write any JavaScript code. Remember to add 'nestui-tabs' class to <div> markup. Each tab panel is created via sub <div> markup, the usage is same as panel.
 * 
 * <div id="tt" class="nestui-tabs" style="width:500px;height:250px;">
 *     <div title="Tab1" style="padding:20px;display:none;">
 *         tab1
 *     </div>
 *     <div title="Tab2" data-options="closable:true" style="overflow:auto;padding:20px;display:none;">
 *         tab2
 *     </div>
 *     <div title="Tab3" data-options="iconCls:'icon-reload',closable:true" style="display:none;">
 *         tab3
 *     </div>
 * </div>
 * 2. Create tabs programatically
 * 
 * Now we create tabs programatically, we catch the 'onSelect' event also.
 * 
 * $('#tt').tabs({
 *     border:false,
 *     onSelect:function(title){
 *         alert(title+' is selected');
 *     }
 * });
 * Add new tab panel
 * 
 * Add a new tab panel with mini tools, the mini tools icon(8x8) is placed before the close button.
 * 
 * // add a new tab panel
 * $('#tt').tabs('add',{
 *     title:'New Tab',
 *     content:'Tab Body',
 *     closable:true,
 *     tools:[{
 *         iconCls:'icon-mini-refresh',
 *         handler:function(){
 *             alert('refresh');
 *         }
 *     }]
 * });
 * Get the selected Tab
 * 
 * // get the selected tab panel and its tab object
 * var pp = $('#tt').tabs('getSelected');
 * var tab = pp.panel('options').tab;    // the corresponding tab object    
 * 
 * @author Buriosca.cz
 *
 */
public class Tabs {

}

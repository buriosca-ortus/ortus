package cz.burios.wt.widget;

/**
 * Layout
 * 
 * Override defaults with $.fn.layout.defaults.
 * 
 * The layout is the container that has up to five regions: north, south, east, west and center. The center region panel is required but edge region panel is optional. Every edge region panel can be resized by dragging its border, they also can be collapsed by clicking on its collapsing trigger. The layout can be nested, thus users can build what complex layout he wants.
 * 
 * Dependencies:
 * 		- panel
 * 		- resizable
 * 
 * Usage Example
 * Create Layout
 * 
 * 1. Create Layout via markup.
 * 
 * Add 'nestui-layout' class to <div/> markup.
 * 
 * <div id="cc" class="nestui-layout" style="width:600px;height:400px;">
 *     <div data-options="region:'north',title:'North Title',split:true" style="height:100px;"></div>
 *     <div data-options="region:'south',title:'South Title',split:true" style="height:100px;"></div>
 *     <div data-options="region:'east',title:'East',split:true" style="width:100px;"></div>
 *     <div data-options="region:'west',title:'West',split:true" style="width:100px;"></div>
 *     <div data-options="region:'center',title:'center title'" style="padding:5px;background:#eee;"></div>
 * </div>
 * 2. Create layout on whole page.
 * 
 * <body class="nestui-layout">
 *     <div data-options="region:'north',title:'North Title',split:true" style="height:100px;"></div>
 *     <div data-options="region:'south',title:'South Title',split:true" style="height:100px;"></div>
 *     <div data-options="region:'east',title:'East',split:true" style="width:100px;"></div>
 *     <div data-options="region:'west',title:'West',split:true" style="width:100px;"></div>
 *     <div data-options="region:'center',title:'center title'" style="padding:5px;background:#eee;"></div>
 * </body>
 * 3. Create nested layout.
 * 
 * Notice that the west panel of inner layout is collapsed.
 * 
 * <body class="nestui-layout">
 *     <div data-options="region:'north'" style="height:100px"></div>
 *     <div data-options="region:'center'">
 *         <div class="nestui-layout" data-options="fit:true">
 *             <div data-options="region:'west',collapsed:true" style="width:180px"></div>
 *             <div data-options="region:'center'"></div>
 *         </div>
 *     </div>
 * </body>
 * 4. Loading content with ajax
 * 
 * The layout is created based on panel. Each region panel provides built-in support for asynchronously loading content from URLs. Using the async loading technology, users can make their layout page display more faster.
 * 
 * <body class="nestui-layout">
 *     <div data-options="region:'west',href:'west_content.php'" style="width:180px" ></div>
 *     <div data-options="region:'center',href:'center_content.php'" ></div>
 * </body>
 * 
 * Collpase Layout Panel
 * 
 * $('#cc').layout();
 * // collapse the west panel
 * $('#cc').layout('collapse','west');
 * 
 * Add west region panel with tool buttons
 * 
 * $('#cc').layout('add',{
 *     region: 'west',
 *     width: 180,
 *     title: 'West Title',
 *     split: true,
 *     tools: [{
 *         iconCls:'icon-add',
 *         handler:function(){alert('add')}
 *     },{
 *         iconCls:'icon-remove',
 *         handler:function(){alert('remove')}
 *     }]
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class Layout {

}

package cz.burios.wt.widget;

/**
 * SearchBox
 * 
 * Extend from $.fn.textbox.defaults. Override defaults with $.fn.searchbox.defaults.
 * 
 * The searchbox prompt the user to enter search value. It can combine a menu that allows the user to select different searching category. The searching action will be executed when the user press ENTER key or click the search button on the right of component.
 * 
 * 
 * Dependencies:
 * 		- textbox
 * 		- menubutton
 * 
 * Usage Example
 * Create SearchBox
 * 
 * 1. Create from markup. Add 'nestui-searchbox' class to <input/> markup.
 * 
 * <script type="text/javascript">
 *     function qq(value,name){
 *         alert(value+":"+name)
 *     }
 * </script>
 * 
 * <input id="ss" class="nestui-searchbox" style="width:300px" data-options="searcher:qq,prompt:'Please Input Value',menu:'#mm'"></input>
 *         
 * <div id="mm" style="width:120px">
 *     <div data-options="name:'all',iconCls:'icon-ok'">All News</div>
 *     <div data-options="name:'sports'">Sports News</div>
 * </div>
 * 2. Create programatically.
 * 
 * <input id="ss"></input>
 * <div id="mm" style="width:120px">
 *     <div data-options="name:'all',iconCls:'icon-ok'">All News</div>
 *     <div data-options="name:'sports'">Sports News</div>
 * </div>
 * $('#ss').searchbox({
 *     searcher:function(value,name){
 *         alert(value + "," + name)
 *     },
 *     menu:'#mm',
 *     prompt:'Please Input Value'
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class SearchBox {

}

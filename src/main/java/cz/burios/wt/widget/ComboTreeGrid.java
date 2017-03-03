package cz.burios.wt.widget;

/**
 * ComboTreeGrid
 * 
 * Extend from $.fn.combo.defaults and $.fn.treegrid.defaults. Override defaults with $.fn.combotreegrid.defaults.
 * 
 * The combotreegrid combines the selection control with drop-down treegrid. It enables the user to find and select a value quickly from the treegrid. The combotreegrid supports a treegrid with tree-state checkboxes for convenient multiple selection.
 * 
 * 
 * Dependencies:
 * 		- combo
 * 		- treegrid
 * 
 * Usage Example
 * Create ComboTreeGrid
 * 
 * 1. Create a combotreegrid from markup.
 * 
 * <input class="nestui-combotreegrid" data-options="
 *         width:'100%',
 *         panelWidth:500,
 *         label:'Select Item:',
 *         labelPosition:'top',
 *         url:'treegrid_data1.json',
 *         idField:'id',
 *         treeField:'name',
 *         columns:[[
 *             {field:'name',title:'Name',width:200},
 *             {field:'size',title:'Size',width:100},
 *             {field:'date',title:'Date',width:100}
 *         ]]">
 * 2. The combotreegrid can be created from existing <select> or <input> element using javascript.
 * 
 * <input id="cc" name="name">
 * $(function(){
 *     $('#cc').combogrid({
 *         value:'006',
 *         width:'100%',
 *         panelWidth:500,
 *         label:'Select Item:',
 *         labelPosition:'top',
 *         url:'treegrid_data1.json',
 *         idField:'id',
 *         treeField:'name',
 *         columns:[[
 *             {field:'name',title:'Name',width:200},
 *             {field:'size',title:'Size',width:100},
 *             {field:'date',title:'Date',width:100}
 *         ]]
 *     });
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class ComboTreeGrid {

}

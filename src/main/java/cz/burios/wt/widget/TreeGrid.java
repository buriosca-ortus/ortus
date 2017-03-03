package cz.burios.wt.widget;

/**
 * TreeGrid
 * 
 * Extend from $.fn.datagrid.defaults. Override defaults with $.fn.treegrid.defaults.
 * 
 * 
 * The treegrid is used to show hierarchical data in grid. It is based on datagrid and combines treeview and editable grid. The treegrid allows you to create customizable, async expandable rows and show hierarchical data in muliple columns.
 * 
 * 
 * Dependencies:
 * 		- datagrid
 * 
 * Usage Example
 * Create treegrid in HTML markup. For the most part, the treegrid follows the same structure and formatting as datagrid.
 * 
 * <table id="tt" class="nestui-treegrid" style="width:600px;height:400px"
 *         data-options="url:'get_data.php',idField:'id',treeField:'name'">
 *     <thead>
 *         <tr>
 *             <th data-options="field:'name',width:180">Task Name</th>
 *             <th data-options="field:'persons',width:60,align:'right'">Persons</th>
 *             <th data-options="field:'begin',width:80">Begin Date</th>
 *             <th data-options="field:'end',width:80">End Date</th>
 *         </tr>
 *     </thead>
 * </table>
 * Create treegrid using javascript.
 * 
 * <table id="tt" style="width:600px;height:400px"></table>
 * $('#tt').treegrid({
 *     url:'get_data.php',
 *     idField:'id',
 *     treeField:'name',
 *     columns:[[
 *         {title:'Task Name',field:'name',width:180},
 *         {field:'persons',title:'Persons',width:60,align:'right'},
 *         {field:'begin',title:'Begin Date',width:80},
 *         {field:'end',title:'End Date',width:80}
 *     ]]
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class TreeGrid {

}

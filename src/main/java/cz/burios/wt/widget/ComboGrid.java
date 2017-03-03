package cz.burios.wt.widget;

/**
 * ComboGrid
 * 
 * Extend from $.fn.combo.defaults and $.fn.datagrid.defaults. Override defaults with $.fn.combogrid.defaults.
 * 
 * The combogrid combines an editable text box with drop-down datagrid panel, from which enables users to quickly find and select. The combogrid provides keyboard navigation support for selecting an item.
 * 
 * Dependencies:
 * 		- combo
 * 		- datagrid
 * 
 * Usage Example
 * Create ComboGrid
 * 
 * 1. Create a combogrid from markup.
 * 
 * <select id="cc" class="nestui-combogrid" name="dept" style="width:250px;"
 *         data-options="
 *             panelWidth:450,
 *             value:'006',
 *             idField:'code',
 *             textField:'name',
 *             url:'datagrid_data.json',
 *             columns:[[
 *                 {field:'code',title:'Code',width:60},
 *                 {field:'name',title:'Name',width:100},
 *                 {field:'addr',title:'Address',width:120},
 *                 {field:'col4',title:'Col41',width:100}
 *             ]]
 *         "></select>
 * 2. The combogrid can be created from existing <select> or <input> element using javascript.
 * 
 * <input id="cc" name="dept" value="01">
 * $('#cc').combogrid({
 *     panelWidth:450,
 *     value:'006',
 * 
 *     idField:'code',
 *     textField:'name',
 *     url:'datagrid_data.json',
 *     columns:[[
 *         {field:'code',title:'Code',width:60},
 *         {field:'name',title:'Name',width:100},
 *         {field:'addr',title:'Address',width:120},
 *         {field:'col4',title:'Col41',width:100}
 *     ]]
 * });
 * Autocomplete Functionality
 * 
 * Let's add advanced auto-complete functionality to the combogrid. The drop-down datagrid will display the possible results according to the user types.
 * 
 * $('#cc').combogrid({
 *     delay: 500,
 *     mode: 'remote',
 *     url: 'get_data.php',
 *     idField: 'id',
 *     textField: 'name',
 *     columns: [[
 *         {field:'code',title:'Code',width:120,sortable:true},
 *         {field:'name',title:'Name',width:400,sortable:true}
 *     ]]
 * });
 * On server side, the 'q' parameter must be retrieve first. The user can query the database and then return an sql result in JSON format to the browser.
 * 
 * get_data.php:
 * 
 * $q = isset($_POST['q']) ? $_POST['q'] : '';  // the request parameter
 * // query database and return JSON result data
 * $rs = mysql_query("select * from item where name like '$q%'");
 * echo json_encode(...);
 * 
 * @author Buriosca.cz
 *
 */
public class ComboGrid {

}

package cz.burios.wt.widget;

/**
 * DataGrid
 * 
 * Contents
 * 
 * Overview
 * Usage Example
 * DataGrid Properties
 * Column Properties
 * Editor
 * DataGrid View
 * Events
 * Methods
 * Extend from $.fn.panel.defaults. Override defaults with $.fn.datagrid.defaults.
 * 
 * The datagrid displays data in a tabular format and offers rich support to select, sort, group and edit data. The datagrid has been designed to reduce development time and to require no specific knowledge from developers. It is both featherweight and feature-rich. Cell merging, multi-column headers, frozen columns and footers are just a few of its features.
 * 
 * Dependencies:
 * 		- panel
 * 		- resizable
 * 		- linkbutton
 * 		- pagination
 * 
 * Usage Example
 * Create datagrid from an existing table element, defining columns, rows, and data in html.
 * 
 * <table class="nestui-datagrid">
 *     <thead>
 *         <tr>
 *             <th data-options="field:'code'">Code</th>
 *             <th data-options="field:'name'">Name</th>
 *             <th data-options="field:'price'">Price</th>
 *         </tr>
 *     </thead>
 *     <tbody>
 *         <tr>
 *             <td>001</td><td>name1</td><td>2323</td>
 *         </tr>
 *         <tr>
 *             <td>002</td><td>name2</td><td>4612</td>
 *         </tr>
 *     </tbody>
 * </table>
 * Create datagrid via <table> markup. The nested <th> tags define the columns on the table.
 * 
 * <table class="nestui-datagrid" style="width:400px;height:250px" data-options="url:'datagrid_data.json',fitColumns:true,singleSelect:true">
 *     <thead>
 *         <tr>
 *             <th data-options="field:'code',width:100">Code</th>
 *             <th data-options="field:'name',width:100">Name</th>
 *             <th data-options="field:'price',width:100,align:'right'">Price</th>
 *         </tr>
 *     </thead>
 * </table>
 * Create datagrid using javascript is also allowed.
 * 
 * <table id="dg"></table>
 * $('#dg').datagrid({
 *     url:'datagrid_data.json',
 *     columns:[[
 *         {field:'code',title:'Code',width:100},
 *         {field:'name',title:'Name',width:100},
 *         {field:'price',title:'Price',width:100,align:'right'}
 *     ]]
 * });
 * Query data with some parameters.
 * 
 * $('#dg').datagrid('load', {
 *     name: 'nestui',
 *     address: 'ho'
 * });
 * After changing data to server, refresh the front data.
 * 
 * $('#dg').datagrid('reload');    // reload the current page data
 * 
 * @author Buriosca.cz
 *
 */
public class DataGrid {

}

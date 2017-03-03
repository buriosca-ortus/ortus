package cz.burios.wt.widget;

/**
 * PropertyGrid
 * 
 * Extend from $.fn.datagrid.defaults. Override defaults with $.fn.propertygrid.defaults.
 * 
 * The propertygrid provides users an interface for browsing and editing the properties of an object. The property grid is an inline editing datagrid. It is fairly easy to use. Users can easily create a hierarchical list of editable properties and represent any data type of item. The property grid comes with a built-in sorting and grouping features.
 * 
 * 
 * Dependencies:
 * 		- datagrid
 * 
 * Usage
 * Create a propertygrid in markup. Notice that the columns have been built-in and don't need to declare them again.
 * 
 * <table id="pg" class="nestui-propertygrid" style="width:300px" data-options="url:'get_data.php',showGroup:true,scrollbarSize:0"></table>
 * Create a propertygrid using javascript.
 * 
 * <table id="pg" style="width:300px"></table>
 * $('#pg').propertygrid({
 *     url: 'get_data.php',
 *     showGroup: true,
 *     scrollbarSize: 0
 * });
 * Append a new row to propertygrid.
 * 
 * var row = {
 *   name:'AddName',
 *   value:'',
 *   group:'Marketing Settings',
 *   editor:'text'
 * };
 * $('#pg').propertygrid('appendRow',row);
 * 
 * Row Data
 * 
 * The propertygrid extend from datagrid. It's row data format is same as datagrid. As a property row, the following fields are required:
 * name: the field name.
 * value: the field value to be edited.
 * group: the group field value.
 * editor: the editor while editing property value.
 * 
 * Row data example:
 * 
 * {"total":4,"rows":[
 *     {"name":"Name","value":"Bill Smith","group":"ID Settings","editor":"text"},
 *     {"name":"Address","value":"","group":"ID Settings","editor":"text"},
 *     {"name":"SSN","value":"123-456-7890","group":"ID Settings","editor":"text"},
 *     {"name":"Email","value":"bill@gmail.com","group":"Marketing Settings","editor":{
 *         "type":"validatebox",
 *         "options":{
 *             "validType":"email"
 *         }
 *     }}
 * ]}
 * 
 * @author Buriosca.cz
 *
 */
public class PropertyGrid {

}

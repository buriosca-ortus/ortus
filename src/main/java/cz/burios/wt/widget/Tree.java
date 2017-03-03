package cz.burios.wt.widget;

/**
 * Tree
 * 
 * 
 * Override defaults with $.fn.tree.defaults.
 * 
 * The tree displays hierarchical data in a tree structure in a web page. 
 * It provides users expand, collapse, drag and drop, editing and async loading functionality.
 * 
 * 
 * Dependencies
 * 		- draggable
 * 		- droppable
 * 
 * Usage Example
 * Tree can be definded in <ul> element. The markup can defines leaf and children. The nodes will be <li> elements within ul list. The following shows the elements that will be used to make the tree node nested within the ul elements.
 * 
 * <ul id="tt" class="easyui-tree">
 *     <li>
 *         <span>Folder</span>
 *         <ul>
 *             <li>
 *                 <span>Sub Folder 1</span>
 *                 <ul>
 *                     <li><span><a href="#">File 11</a></span></li>
 *                     <li><span>File 12</span></li>
 *                     <li><span>File 13</span></li>
 *                 </ul>
 *             </li>
 *             <li><span>File 2</span></li>
 *             <li><span>File 3</span></li>
 *         </ul>
 *     </li>
 *     <li><span>File21</span></li>
 * </ul>
 * Tree can also be defined in an empty <ul> element and load data using javascript.
 * 
 * <ul id="tt"></ul>
 * $('#tt').tree({
 *     url:'tree_data.json'
 * });
 * 
 * Use loadFilter to process the json data from ASP.NET web services.
 * 
 * $('#tt').tree({
 *     url: ...,
 *     loadFilter: function(data){
 *         if (data.d){
 *             return data.d;
 *         } else {
 *             return data;
 *         }
 *     }
 * });
 * Tree Data Format
 * Every node can contains following properties:
 * 
 * id: node id, which is important to load remote data
 * text: node text to show
 * state: node state, 'open' or 'closed', default is 'open'. When set to 'closed', the node have children nodes and will load them from remote site
 * checked: Indicate whether the node is checked selected.
 * attributes: custom attributes can be added to a node
 * children: an array nodes defines some children nodes
 * Some example:
 * 
 * [{
 *     "id":1,
 *     "text":"Folder1",
 *     "iconCls":"icon-save",
 *     "children":[{
 *         "text":"File1",
 *         "checked":true
 *     },{
 *         "text":"Books",
 *         "state":"open",
 *         "attributes":{
 *             "url":"/demo/book/abc",
 *             "price":100
 *         },
 *         "children":[{
 *             "text":"PhotoShop",
 *             "checked":true
 *         },{
 *             "id": 8,
 *             "text":"Sub Bookds",
 *             "state":"closed"
 *         }]
 *     }]
 * },{
 *     "text":"Languages",
 *     "state":"closed",
 *     "children":[{
 *         "text":"Java"
 *     },{
 *         "text":"C#"
 *     }]
 * }]
 * 
 * The Async Tree
 * The tree supports the built-in async loading mode, with which users create an empty tree, 
 * then specify a server side that dynamically returns the JSON data to use to populate the tree with asynchronously and on demand. Here is an example:
 * 
 * <ul class="easyui-tree" data-options="url:'get_data.php'"></ul>
 * The tree is loaded with the URL 'get_data.php'. The child nodes to be loaded dependent on the parent node state. 
 * When expand a closed node, if the node has no child nodes loaded, it will send node id value 
 * as the http request parameter named 'id' to server via the URL defined above to retrieve child nodes.
 * 
 * Looks at the data returned from server:
 * 
 * [{
 *     "id": 1,
 *     "text": "Node 1",
 *     "state": "closed",
 *     "children": [{
 *         "id": 11,
 *         "text": "Node 11"
 *     },{
 *         "id": 12,
 *         "text": "Node 12"
 *     }]
 * },{
 *     "id": 2,
 *     "text": "Node 2",
 *     "state": "closed"
 * }]
 * The node 1 and node 2 are closed, when expand the node 1, it will directly show its child nodes. 
 * When expand node 2, it will send the value(2) to server to retrieve child nodes.

 * This tutorial Create Async Tree shows how to write server code to return the tree data on demand.
 * 
 * @author Buriosca.cz
 *
 */
public class Tree {

}

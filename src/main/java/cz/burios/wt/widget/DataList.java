package cz.burios.wt.widget;

/**
 * DataList
 * 
 * Extend from $.fn.datagrid.defaults. Override defaults with $.fn.datalist.defaults.
 * 
 * The datalist renders items in a list. It is a special datagrid that displays data in one column. You can define the column format and style for each rows.
 * 
 * Dependencies:
 * 		- datagrid
 * 
 * Usage Example
 * Create datalist from markup.
 * 
 * <ul class="nestui-datalist" title="DataList" style="width:400px;height:250px">
 *     <li value="AL">Alabama</li>
 *     <li value="AK">Alaska</li>
 *     <li value="AZ">Arizona</li>
 *     <li value="AR">Arkansas</li>
 *     <li value="CA">California</li>
 *     <li value="CO">Colorado</li>
 * </ul>
 * Create datalist using javascript.
 * 
 * <div id="dl"></div>
 * $('#dl').datalist({
 *     url: 'datalist_data1.json',
 *     checkbox: true,
 *     lines: true
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class DataList {

}

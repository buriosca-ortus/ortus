package cz.burios.wt.widget;

/**
 * ComboBox
 * 
 * Extend from $.fn.combo.defaults. Override defaults with $.fn.combobox.defaults.
 * 
 * The combobox display an editable text box and drop-down list, from which the user can select one or multiple values. The user can type text directly into the top of list, or select one or more of present values from the list.
 * 
 * Dependencies:
 * 		- combo
 * 
 * Usage Example
 * Create combobox from <select> element with a pre-defined structure.
 * 
 * <select id="cc" class="nestui-combobox" name="dept" style="width:200px;">
 *     <option value="aa">aitem1</option>
 *     <option>bitem2</option>
 *     <option>bitem3</option>
 *     <option>ditem4</option>
 *     <option>eitem5</option>
 * </select>
 * Create combobox from <input> markup.
 * 
 * <input id="cc" class="nestui-combobox" name="dept" data-options="valueField:'id',textField:'text',url:'get_data.php'">
 * Create combobox using javascript.
 * 
 * <input id="cc" name="dept" value="aa">
 * $('#cc').combobox({
 *     url:'combobox_data.json',
 *     valueField:'id',
 *     textField:'text'
 * });
 * Create two dependent comboboxes.
 * 
 * <input id="cc1" class="nestui-combobox" data-options="
 *         valueField: 'id',
 *         textField: 'text',
 *         url: 'get_data1.php',
 *         onSelect: function(rec){
 *             var url = 'get_data2.php?id='+rec.id;
 *             $('#cc2').combobox('reload', url);
 *         }">
 * <input id="cc2" class="nestui-combobox" data-options="valueField:'id',textField:'text'">
 * The json data format sample:
 * 
 * [{
 *     "id":1,
 *     "text":"text1"
 * },{
 *     "id":2,
 *     "text":"text2"
 * },{
 *     "id":3,
 *     "text":"text3",
 *     "selected":true
 * },{
 *     "id":4,
 *     "text":"text4"
 * },{
 *     "id":5,
 *     "text":"text5"
 * }]
 * 
 * @author Buriosca.cz
 *
 */
public class ComboBox {

}

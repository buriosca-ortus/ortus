package cz.burios.wt.widget;

/**
 * NumberSpinner
 * 
 * Extend from $.fn.spinner.defaults and $.fn.numberbox.defaults. Override defaults with $.fn.numberspinner.defaults.
 * 
 * The numberspinner is created based on spinner and numberbox. It can convert the inputed value into different types such as numeric, percentage, current, etc. It also allows the user to scroll to a desired value using the up/down spinner buttons.
 * 
 * Dependencies:
 * 		- spinner
 * 		- numberbox
 * 
 * Usage Example
 * Create numberspinner from markup.
 * 
 * <input id="ss" class="nestui-numberspinner" style="width:80px;" required="required" data-options="min:10,max:100,editable:false">
 * Create numberspinner using javascript.
 * 
 * <input id="ss" required="required" style="width:80px;">
 * $('#ss').numberspinner({
 *     min: 10,
 *     max: 100,
 *     editable: false
 * });
 * Create numberspinner and format the number as a currency string.
 * 
 * <input class="nestui-numberspinner" value="1234567890" style="width:150px;" data-options="required:true,precision:2,groupSeparator:',',decimalSeparator:'.',prefix:'$'">
 * 
 * @author Buriosca.cz
 *
 */
public class NumberSpinner {

}

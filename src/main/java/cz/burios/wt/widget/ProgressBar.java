package cz.burios.wt.widget;

/**
 * ProgressBar
 * 
 * Override defaults with $.fn.progressbar.defaults.
 * 
 * The progressbar provides a feedback of showing progress of an long-running operation. The progress can be updated to let the user know that some operation is currently executing.
 * 
 * 
 * Dependencies:
 * 		- none
 * 
 * Usage Example
 * Create ProgressBar
 * 
 * The ProgressBar component can be created from html markup or programatically. Creation from markup is even easier. Add 'nestui-progressbar' class to <div/> markup.
 * 
 * <div id="p" class="nestui-progressbar" data-options="value:60" style="width:400px;"></div>
 * Create ProgressBar using javascript.
 * 
 * <div id="p" style="width:400px;"></div>
 * $('#p').progressbar({
 *     value: 60
 * });
 * Get or Set Value
 * 
 * We get the current value and set a new value for this component.
 * 
 * var value = $('#p').progressbar('getValue');
 * if (value < 100){
 *     value += Math.floor(Math.random() * 10);
 *     $('#p').progressbar('setValue', value);
 * }
 * 
 * @author Buriosca.cz
 *
 */
public class ProgressBar {

}

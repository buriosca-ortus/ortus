package cz.burios.wt.widget;

/**
 * Override defaults with $.fn.tooltip.defaults.
 * 
 * When a user move the mouse pointer over an element, a tooltip message window appears to display additional information. The tooltip content can contain any html elements that come from the page or via ajax.
 * 
 * Usage Example
 * 
 * Create Tooltip
 * 
 * 1. Create tooltip from markup, add 'nestui-tooltip' class to the element, no javascript code is needed.
 * 
 * <a href="#" title="This is the tooltip message." class="nestui-tooltip">Hover me</a>
 * 
 * 2. Create tooltip using javascript.
 * 
 * <a id="dd" href="javascript:void(0)">Click here</a>
 * $('#dd').tooltip({
 * 		position: 'right',
 * 		content: '<span style="color:#fff">This is the tooltip message.</span>',
 * 		onShow: function(){
 * 			$(this).tooltip('tip').css({
 * 				backgroundColor: '#666',
 * 				borderColor: '#666'
 * 			});
 * 		}
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class Tooltip {

}

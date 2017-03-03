package cz.burios.wt.widget;

/**
 * Slider
 * 
 * Override defaults with $.fn.slider.defaults.
 * 
 * The slider enables the user to choose a numeric value from a finite range. When moving the thumb control along the track, a tip will display to represent the current value. The user can customize slider by setting its properties.
 * 
 * 
 * Dependencies:
 * 		- draggable
 * 
 * Usage Example
 * When using as a form field, create slider from <input> markup.
 * 
 * <input class="nestui-slider" value="12"  style="width:300px" data-options="showTip:true,rule:[0,'|',25,'|',50,'|',75,'|',100]">
 * Create slider from <div/> is also allowed but the 'value' attribute is invalid.
 * 
 * <div class="nestui-slider" data-options="min:10,max:90,step:10" style="width:300px"></div>
 * Create slider programatically.
 * 
 * <div id="ss" style="height:200px"></div>
 * $('#ss').slider({
 *     mode: 'v',
 *     tipFormatter: function(value){
 *         return value + '%';
 *     }
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class Slider {

}

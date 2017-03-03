package cz.burios.wt.widget;

/**
 * SwitchButton
 * 
 * Override defaults with $.fn.switchbutton.defaults.
 * 
 * The switch button can be used in a <form>. It has two states: 'on' and 'off'. The user can click or tap to toggle the switch. Labels of the states are customizable.
 * 
 * Usage
 * Create switchbutton from markup.
 * 
 * <input class="nestui-switchbutton" checked>
 * <input class="nestui-switchbutton" data-options="onText:'Yes',offText:'No'">
 * Create switchbutton using javascript.
 * 
 * <input id="sb" style="width:200px;height:30px">
 * <script type="text/javascript">
 *     $(function(){
 *         $('#sb').switchbutton({
 *             checked: true,
 *             onChange: function(checked){
 *                 console.log(checked);
 *             }
 *         })
 *     })
 * </script>
 * 
 * @author Buriosca.cz
 *
 */
public class SwitchButton {

}

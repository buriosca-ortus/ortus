package cz.burios.wt.widget;

/**
 * PasswordBox
 * 
 * Extend from $.fn.textbox.defaults. Override defaults with $.fn.passwordbox.defaults.
 * 
 * The passwordbox allows the user to input passwords with nice feedback. The passwordbox protects your password by showing dots instead of the password text. It can display an eye icon to help make sure that you typed the right characters.
 * 
 * Dependencies:
 * 		- textbox
 * 
 * Usage
 * Create passwordbox from markup.
 * 
 * <input class="nestui-passwordbox" prompt="Password" iconWidth="28" style="width:100%;height:34px;padding:10px">
 * Create passwordbox by using javascript.
 * 
 * <input id="pb" type="text" style="width:300px">
 * $(function(){
 *     $('#pb').passwordbox({
 *         prompt: 'Password',
 *         showEye: true
 *     });
 * });
 * 
 * @author Buriosca.cz
 *
 */
public class PasswordBox {

}

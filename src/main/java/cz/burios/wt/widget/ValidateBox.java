package cz.burios.wt.widget;

/**
 * ValidateBox
 * 
 * Override defaults with $.fn.validatebox.defaults.
 * 
 * The validatebox is designed to validate the form input fields. If users enter invalid values, it will change the background color, display the alarm icon and a tooltip message. The validatebox can be integrated with form plugin and will prevent invalid fields from submission.
 * 
 * Dependencies:
 * 		- tooltip
 * 
 * 	Usage
 * Create validatebox from markup.
 * 
 * <input id="vv" class="nestui-validatebox" data-options="required:true,validType:'email'">
 * 
 * Create validatebox using javascript.
 * 
 * <input id="vv">
 * $('#vv').validatebox({
 * 		required: true,
 * 		validType: 'email'
 * });
 * 
 * To check password and retype password are same.
 * 
 * // extend the 'equals' rule
 * $.extend($.fn.validatebox.defaults.rules, {
 * 		equals: {
 * 			validator: function(value,param){
 * 				return value == $(param[0]).val();
 * 			},
 * 			message: 'Field do not match.'
 * 		}
 * });
 * 
 * <input id="pwd" name="pwd" type="password" class="nestui-validatebox" data-options="required:true">
 * <input id="rpwd" name="rpwd" type="password" class="nestui-validatebox" required="required" validType="equals['#pwd']">
 * 		
 * Validate Rule
 * 	The validate rule is defined by using required and validType property, here are the rules already implemented:
 * 	email: Match email regex rule.
 * 	url: Match URL regex rule.
 * 	length[0,100]: Between x and x characters allowed.
 * 	remote['http://.../action.do','paramName']: Send ajax request to do validate value, return 'true' when successfully.
 * 
 * To custom validate rule, override $.fn.validatebox.defaults.rules that defines a validator function and invalid message. For example, to define a minLength valid type:
 * 
 * $.extend($.fn.validatebox.defaults.rules, {
 * 		minLength: {
 * 			validator: function(value, param){
 * 				return value.length >= param[0];
 * 			},
 * 			message: 'Please enter at least {0} characters.'
 * 		}
 * });
 * 
 * Now you can use the minLength validtype to define an input box that should be inputed at least 5 characters:
 * 
 * <input class="nestui-validatebox" data-options="validType:'minLength[5]'">
 * 
 * 
 * @author Buriosca.cz
 *
 */
public class ValidateBox {

}

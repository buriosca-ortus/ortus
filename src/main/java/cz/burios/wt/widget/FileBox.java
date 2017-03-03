package cz.burios.wt.widget;

/**
 * FileBox
 * 
 * Extend from $.fn.textbox.defaults. Override defaults with $.fn.filebox.defaults.
 * 
 * The filebox component represents a file field of the forms. It extends from textbox, many properties, events and methods are inherited from textbox. But due to the security issue of the browsers, some methods such as 'setValue' can not be used on the filebox component.
 * 
 * Dependencies:
 * 		- textbox
 * 
 * Usage
 * Create filebox from markup.
 * 
 * <input class="nestui-filebox" style="width:300px">
 * Create filebox by using javascript.
 * 
 * <input id="fb" type="text" style="width:300px">
 * $('#fb').filebox({
 *     buttonText: 'Choose File',
 *     buttonAlign: 'left'
 * })
 * 
 * @author Buriosca.cz
 *
 */
public class FileBox {

}

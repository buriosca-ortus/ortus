package cz.burios.wt.widget;

import cz.burios.wt.widget.Widget.WidgetClass;

public class MenuButtonDefs extends WidgetDefs {

	public MenuButtonDefs() {
		super(null, WidgetClass.menubutton);
	}

	// Properties
	
	/*
	 *  plain
	 *  boolean
	 *  True to show plain effect.
	 *  true
	 */
	
	/*
	 *  menu
	 *  string
	 *  A selector to create a corresponding menu.
	 *  null
	 */
	
	/*
	 *  duration
	 *  number
	 *  Defines duration time in milliseconds to show menu when hovering the button.
	 *  100
	 */
	
	// Methods
	
	/*
	 * options	none	Return the options object.
	 */
	
	/*
	 * disable
	 * none
	 * Disable the splitbutton. Code example:
	 *  	$('#sb').splitbutton('disable');
	 */
	
	/*
	 * enable
	 * none
	 * Enable the splitbutton. Code example:
	 *  	$('#sb').splitbutton('enable');
	 */
	
	/*
	 * destroy	
	 * none	
	 * Destroy the splitbutton.
	 */
}

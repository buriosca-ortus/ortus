package cz.burios.wt.widget;

import cz.burios.wt.widget.Widget.WidgetClass;

/**
 * Properties
 * 
 * The properties extend from linkbutton, below is the added properties for splitbutton.
 * 
 * Name		Type	Description																		Default
 * 
 * plain	boolean	True to show plain effect.														true
 * menu		string	A selector to create a corresponding menu.										null
 * duration	number	Defines duration time in milliseconds to show menu when hovering the button.	100
 * 
 * Methods
 * 
 * The methods extend from menubutton, below is the added or overridden methods for splitbutton.
 * 
 * Name		Parameter	Description
 * 
 * options	none		Return the options object.
 * disable	none		Disable the splitbutton. Code example:
 * 		$('#sb').splitbutton('disable');
 * enable	none		Enable the splitbutton. Code example:
 * 		$('#sb').splitbutton('enable');
 * destroy	none		Destroy the splitbutton.
 * 
 * @author Buriosca.cz
 *
 */
public class SplitButtonDefs extends WidgetDefs {

	public SplitButtonDefs() {
		super(null, WidgetClass.splitbutton);
	}

}

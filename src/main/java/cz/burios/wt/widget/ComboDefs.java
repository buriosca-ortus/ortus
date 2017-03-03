package cz.burios.wt.widget;

import cz.burios.wt.widget.Widget.WidgetClass;

/**
 * Dependencies:
 * 		- textbox
 * 		- panel
 * 
 * Properties
 * The properties extend from textbox, below is the added properties for combo.
 * 
 * Name					Type		Description																			Default
 * width				number		The width of the component.															auto
 * height				number		The height of the component. Available since version 1.3.2.							22
 * panelWidth			number		The width of the drop down panel.													null
 * panelHeight			number		The height of the drop down panel.													200
 * panelMinWidth		number		The minimum width of the drop down panel. Available since version 1.4.				null
 * panelMaxWidth		number		The maximum width of the drop down panel. Available since version 1.4.				null
 * panelMinHeight		number		The minimum height of the drop down panel. Available since version 1.4.				null
 * panelMaxHeight		number		The maximum height of the drop down panel. Available since version 1.4.				null
 * panelAlign			string		The panel alignment. Possible values are: 'left', 'right'. 
 * 									Available since version 1.3.6.														left
 * multiple				boolean		Defines if support multiple selection.												false
 * multivalue			boolean		Defines if to submit the multiple values. Available since version 1.5.1.			true
 * reversed				boolean		Defines if to restore the original value when the inputing box loses focus. 
 * 									Available since version 1.5.1.														false
 * selectOnNavigation	boolean		Defines if to select an item when navigating items with keyboard. 
 * 									Available since version 1.3.3.														true
 * separator			string		The separator char for text when multiple selection.								,
 * editable				boolean		Defines if user can type text directly into the field.								true
 * disabled				boolean		Defines if to disable the field.													false
 * readonly				boolean		Defines if the component is read-only. Available since version 1.3.3.				false
 * hasDownArrow			boolean		Defines if to display the down arrow button.										true
 * value				string		The default value.	
 * delay				number		Delay to do searching from the last key input event.								200
 * keyHandler			object		A function called when user press key. The default keyHandler is defined as:
 * 									keyHandler: {
 * 										up: function(e){},
 * 										down: function(e){},
 * 										left: function(e){},
 * 										right: function(e){},
 * 										enter: function(e){},
 * 										query: function(q,e){}
 * 									}
 * 
 * Events
 * The events extend from textbox, below is the added events for combo.
 * 
 * Name			Parameters			Description
 * onShowPanel	none				Fires when drop down panel show.
 * onHidePanel	none				Fires when drop down panel hide.
 * onChange		newValue, oldValue	Fires when the field value is changed.
 * 
 * Methods
 * The methods extend from textbox, below is the added methods for combo.
 * 
 * Name			Parameter	Description
 * options		none		Return the options object.
 * panel		none		Return the drop down panel object.
 * textbox		none		Retun the textbox object.
 * destroy		none		Destroy the component.
 * resize		width		Resize the component width.
 * showPanel	none		Show the drop down panel.
 * hidePanel	none		Hide the drop down panel.
 * disable		none		Disable the component.
 * enable		none		Enable the component.
 * readonly		mode		Enable/Disable readonly mode. Available since version 1.3.3.
 * 							Usage Example:
 * 
 * 							$('#cc').combo('readonly');		// enable readonly mode
 * 							$('#cc').combo('readonly', true);	// enable readonly mode
 * 							$('#cc').combo('readonly', false);	// disable readonly mode
 * 
 * validate		none		Validate the input value.
 * isValid		none		Return the validate result.
 * clear		none		Clear the component value.
 * reset		none		Reset the component value. Available since version 1.3.2.
 * getText		none		Get the input text.
 * setText		text		Set the text value.
 * getValues	none		Get the component value array.
 * setValues	values		Set the component value array.
 * getValue		none		Get the component value.
 * setValue		value		Set the component value.
﻿
 * 
 * @author Buriosca.cz
 *
 */
public class ComboDefs extends WidgetDefs {

	public ComboDefs() {
		super(null, WidgetClass.combo);
	}

}

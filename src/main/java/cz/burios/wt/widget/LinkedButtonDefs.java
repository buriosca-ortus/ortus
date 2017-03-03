package cz.burios.wt.widget;

import cz.burios.wt.widget.Widget.WidgetClass;

/**
 * Properties
 * 
 * Name			Type		Description																										Default
 * 
 * width		number		The width of this component.																					null
 * height		number		The height of this component.																					null
 * id			string		The id attribute of this component.																				null
 * disabled		boolean		True to disable the button																						false
 * toggle		boolean		True to enable the user to switch its state to selected or unselected. Available since version 1.3.3.			false
 * selected		boolean		Defines if the button's state is selected. Available since version 1.3.3.										false
 * group		string		The group name that indicates what buttons belong to. Available since version 1.3.3.							null
 * plain		boolean		True to show a plain effect.																					false
 * text			string		The button text.																								''
 * iconCls		string		A CSS class to display a 16x16 icon on left.																	null
 * iconAlign	string		Position of the button icon. Possible values are: 'left','right','top','bottom'. Available since version 1.3.2.	left
 * size			string		The button size. Possible values are: 'small','large'. Available since version 1.3.6.							small
 * 
 * Events
 * 
 * Name			Parameters	Description
 * 
 * onClick		none		Fires when click the button. Available since version 1.3.6.
 * 
 * Methods
 * 
 * Name			Parameter	Description
 * 
 * options		none		Return options property.
 * resize		param		Resize the button. Available since version 1.4.
 * 							Code example:
 * 							$('#btn').linkbutton('resize', {
 * 								width: '100%',
 * 								height: 32
 * 							});
 * 
 * disable		none		Disable the button.
 * 							Code example:
 * 								$('#btn').linkbutton('disable');
 * 
 * enable		none		Enable the button.
 * 							Code example:
 * 								$('#btn').linkbutton('enable');
 * 
 * select		none		Select the button. Available since version 1.3.3.
 * unselect		none		Unselect the button. Available since version 1.3.3.
 * 
 * @author Buriosca.cz
 *
 */
public class LinkedButtonDefs extends WidgetDefs {

	public LinkedButtonDefs() {
		super("", WidgetClass.linkbutton);
	}

	/*
	 * width
	 * number
	 * The width of this component.	
	 * null
	 */
	public int width() {
		return (Integer) getElement("width");
	}
	
	public LinkedButtonDefs width(int value) {
		setOption("width", value);
		return this; 
	}
	
	/*
	 * height
	 * number
	 * The height of this component.
	 * null
	 */
	public int height() {
		return (Integer) getElement("height");
	}
	
	public LinkedButtonDefs height(int value) {
		setOption("height", value);
		return this; 
	}

	/*
	 * id
	 * String
	 * The id attribute of this component.	
	 * null
	 */
	public String id() {
		return (String) getElement("id");
	}
	
	public LinkedButtonDefs id(String value) {
		setOption("id", value);
		return this; 
	}

	/*
	 * disabled
	 * boolean
	 * True to disable the button
	 * false
	 */
	
	/*
	 * toggle
	 * boolean
	 * True to enable the user to switch its state to selected or unselected. Available since version 1.3.3.
	 * false
	 */
	
	/*
	 * selected
	 * boolean
	 * Defines if the button's state is selected. Available since version 1.3.3.
	 * false
	 */
	
	/*
	 * group
	 * string
	 * The group name that indicates what buttons belong to. Available since version 1.3.3.
	 * null
	 */
	
	/*
	 * plain
	 * boolean
	 * True to show a plain effect.
	 * false
	 */
	
	/*
	 * text
	 * string
	 * The button text.
	 * ''
	 */
	
	/*
	 * iconCls
	 * string
	 * A CSS class to display a 16x16 icon on left.	
	 * null
	 */
	
	/*
	 * iconAlign
	 * string
	 * Position of the button icon. Possible values are: 'left','right','top','bottom'. Available since version 1.3.2.	
	 * left
	 */
	
	/*
	 * size 
	 * string
	 * The button size. Possible values are: 'small','large'. Available since version 1.3.6.
	 * small
	 */
	
}

package cz.burios.wt.widget;

import cz.burios.wt.widget.Widget.WidgetClass;

/**
 * Dependencies:
 * 		- draggable
 * 		- resizable
 * 		- panel
 * 
 * Properties
 * 
 * The properties extend from panel, below is the overridden and added properties for window.
 * 
 * Name			Type			Description																				Default
 * title		string			The window title text.	New Window
 * collapsible	boolean			Defines if to show collapsible button.													true
 * minimizable	boolean			Defines if to show minimizable button.													true
 * maximizable	boolean			Defines if to show maximizable button.													true
 * closable		boolean			Defines if to show closable button.														true
 * closed		boolean			Defined if to close the window.															false
 * zIndex		number			Window z-index,increase from it.														9000
 * draggable	boolean			Defines if window can be dragged.														true
 * resizable	boolean			Defines if window can be resized.														true
 * shadow		boolean			If set to true,when window show the shadow will show also.								true
 * inline		boolean			Defines how to stay the window, true to stay inside its parent, 
 * 								false to go on top of all elements.														false
 * modal		boolean			Defines if window is a modal window.													false
 * border		boolean,string	Defines the window border style. Possible values are: true,false,'thin','thick'.		true
 * constrain	boolean			Defines if to constrain the window position. Available since version 1.5.				false
 * 
 * Events
 * 
 * The events extend from panel.
 * 
 * Methods
 * 
 * The methods extend from panel, below is the added methods for window.
 * 
 * Name		Parameter	Description
 * window	none		Return the outer window object.
 * hcenter	none		Center the window only horizontally. Available since version 1.3.1.
 * vcenter	none		Center the window only vertically. Available since version 1.3.1.
 * center	none		Center the window on screen. Available since version 1.3.1.
 * 
 * @author Buriosca.cz
 *
 */
public class WindowDefs extends WidgetDefs {

	public WindowDefs() {
		super(null, WidgetClass.window);
	}

}

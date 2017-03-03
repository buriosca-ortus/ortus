package cz.burios.wt.widget;

import cz.burios.wt.widget.Widget.WidgetClass;

/**
 * Container Options
 * 
 * Name			Type		Description																					Default
 * width		number		The width of accordion container.															auto
 * height		number		The height of accordion container.															auto
 * fit			boolean		Set to true to set the accordion container size fit it's parent container.					false
 * border		boolean		Defines if to show the border.																true
 * animate		boolean		Defines if to show animation effect when expand or collapse panel.							true
 * multiple		boolean		True to enable expanding multiple panels at one time. Available since version 1.3.5.		false
 * selected		number		The initialized selected panel index. Available since version 1.3.5.						0
 * 
 * Panel Options
 * The accordion panel options is inhirited from panel, below is the addition properties:
 * 
 * Name			Type		Description	Default
 * selected		boolean		Set to true to expand the panel.															false
 * collapsible	boolean		Defines if to show collapsible button. 
 * 							False will prevent from clicking to expand/collapse this panel.								true
 * 
 * Events
 * 
 * Name			Parameters			Description
 * onSelect			title,index		Fires when a panel is selected.
 * onUnselect		title,index		Fires when a panel is unselected. Available since version 1.3.5.
 * onAdd			title,index		Fires when a new panel is added.
 * onBeforeRemove	title,index		Fires before a panel is removed, return false to cancel the remove action.
 * onRemove			title,index		Fires when a panel is removed.
 * 
 * Methods
 * 
 * Name				Parameter	Description
 * options			none	Return the options of accordion.
 * panels			none	Get all panels.
 * resize			none	Resize the accordion.
 * getSelected		none	Get the first selected panel.
 * getSelections	none	Get the all the selected panels. Available since version 1.3.5.
 * getPanel			which	Get the specified panel. The 'which' parameter can be the title or index of panel.
 * getPanelIndex	panel	Get the specified panel index. Available since version 1.3.
 * 							The example below shows how to get the selected panel index.
 * 
 * 							var p = $('#aa').accordion('getSelected');
 * 							if (p){
 * 								var index = $('#aa').accordion('getPanelIndex', p);
 * 								alert(index);
 * 							}
 * select			which	Select the specified panel. The 'which' parameter can be the title or index of panel.
 * unselect			which	Unselect the specified panel. The 'which' parameter can be the title or index of panel. Available since version 1.3.5.
 * add				options	Add a new panel. By default the added panel will become selected. To add a unselected new panel, pass the 'selected' property and set it to false.
 * 							Code example:
 * 							
 * 							$('#aa').accordion('add', {
 * 								title: 'New Title',
 * 								content: 'New Content',
 * 								selected: false
 * 							});
 * remove			which	Remove the specified panel. The 'which' parameter can be the title or index of panel.
 * 
 * @author Buriosca.cz
 *
 */
public class AccordionDefs extends WidgetDefs {

	public AccordionDefs() {
		super(null, WidgetClass.accordion);
	}

}

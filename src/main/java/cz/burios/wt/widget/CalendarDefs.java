package cz.burios.wt.widget;

import cz.burios.wt.widget.Widget.WidgetClass;

/**
 * Properties
 * Name				Type			Description																			Default
 * width			number			The width of calendar component.													180
 * height			number			The height of calendar component.													180
 * fit				boolean			When true to set the calendar size fit it's parent container.						false
 * border			boolean			Defines if to show the border.														true
 * showWeek			boolean			Defines if to show the week numbers. Available since version 1.5.					false
 * weekNumberHeader	string			The label to display on the week number header. Available since version 1.5.	
 * getWeekNumber	function(date)	The function to return the week number. Available since version 1.5.	
 * firstDay			number			Defines the first day of week. Sunday is 0, Monday is 1, ...						0
 * weeks			array			The list of week to be showed.	['S','M','T','W','T','F','S']
 * months			array			The list of month to be showed.	['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
 * 	year			number			The year of calendar. The example below shows how to create a calendar using the specified year and month.
 * 									<div class="easyui-calendar" data-options="year:2012,month:6" />
 * 									current year(four digits)
 * month			number			The month of calendar.																current month, start with 1
 * current			Date			The current date.																	current date
 * formatter		function(date)	The day formatter function, return the day value. Available since version 1.3.6.
 * 									Code example:
 *									$('#cc').calendar({
 * 										formatter: function(date){
 * 											return date.getDate();
 * 										}
 * 									})
 * styler			function(date)	The styler function for calendar days, return the inline style or CSS class. 
 * 									Available since version 1.3.6.
 * 									Code example:
 * 									$('#cc').calendar({
 * 										styler: function(date){
 * 											if (date.getDay() == 1){
 * 												return 'background-color:#ccc';
 * 												// the function can return predefined css class and inline style
 * 												// return {class:'r1', style:{'color:#fff'}};	
 * 											} else {
 * 												return '';
 * 											}
 * 										}
 * 									})
 * validator		function(date)	The validator function that is used to determine if a calendar day can be selected, return false to prevent from selecting a day. Available since version 1.3.6.
 * 									Code example: 
 * 									$('#cc').calendar({
 * 										validator: function(date){
 * 											if (date.getDay() == 1){return true;}
 * 											else {return false;}
 * 										}
 * 									})
 * 
 * Events
 * 
 * Name			Parameters			Description
 * onSelect		date				Fires when user select a date.
 * 									Code example:
 * 									$('#cc').calendar({
 * 										onSelect: function(date){
 * 											alert(date.getFullYear()+":"+(date.getMonth()+1)+":"+date.getDate());
 * 										}
 * 									});
 * onChange		newDate, oldDate	Fires when change a date. Available since version 1.3.6.
 * 
 * Methods
 * 
 * Name		Parameter	Description
 * options	none		Return the options object.
 * resize	none		Resize the calendar size.
 * moveTo	date		Move the calendar to specified date.
 * 						Code example:
 * 						$('#cc').calendar('moveTo', new Date(2012, 6, 1));
﻿ * 
 * 
 * @author Buriosca.cz
 *
 */
public class CalendarDefs extends WidgetDefs {

	public CalendarDefs() {
		super(null, WidgetClass.calendar);
	}


}

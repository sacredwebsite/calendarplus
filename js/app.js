
/**
 * ownCloud - CalendarPlus
 *
 * @author Sebastian Doell
 * @copyright 2015 sebastian doell sebastian@libasys.de
 * Copyright (c) 2012 Georg Ehrke <ownclouddev at georgswebsite dot de>
 * Copyright (c) 2011 Bart Visscher <bartv@thisnet.nl>
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var CalendarPlus = {
	firstLoading : true,
	appname:'calendarplus',
	calendarConfig:null,
	popOverElem:null,
	searchEventId:null,
	init:function(){
		
		if(CalendarPlus.calendarConfig == null){
			$.getJSON(OC.generateUrl('apps/'+CalendarPlus.appname+'/calendarsettingsgetusersettingscalendar'), function(jsondata){
				if(jsondata.status == 'success'){
					CalendarPlus.calendarConfig=[];
					CalendarPlus.calendarConfig['defaultView'] = jsondata.defaultView;
					CalendarPlus.calendarConfig['agendatime'] = jsondata.agendatime;
					CalendarPlus.calendarConfig['defaulttime'] = jsondata.defaulttime;
					CalendarPlus.calendarConfig['firstDay'] = jsondata.firstDay;
					CalendarPlus.calendarConfig['categories'] = jsondata.categories;
					CalendarPlus.calendarConfig['tags'] = jsondata.tags;
					
					CalendarPlus.calendarConfig['eventSources'] = jsondata.eventSources;
					CalendarPlus.calendarConfig['calendarcolors'] = jsondata.calendarcolors;
					
					CalendarPlus.calendarConfig['mycalendars'] = jsondata.mycalendars;
					CalendarPlus.calendarConfig['myRefreshChecker'] = jsondata.myRefreshChecker;
					CalendarPlus.calendarConfig['choosenCalendar'] = jsondata.choosenCalendar;
					CalendarPlus.calendarConfig['userconfig'] = jsondata.userConfig;
					CalendarPlus.calendarConfig['sharetypeevent'] = jsondata.sharetypeevent;
					CalendarPlus.calendarConfig['sharetypecalendar'] = jsondata.sharetypecalendar;
					
					$('.view button.viewaction').each(function(i,el){
						if(CalendarPlus.calendarConfig['userconfig'][$(el).data('action')]=== 'true'){
							$(el).show();
						}else{
							$(el).hide();
						}
					});
					if(CalendarPlus.calendarConfig['userconfig'][CalendarPlus.calendarConfig['defaultView']] !== 'true'){
						CalendarPlus.calendarConfig['defaultView'] = 'month';
					}
					
					CalendarPlus.initCalendar();
					CalendarPlus.Util.calViewEventHandler();
					
				}
			});
			
		}else{
			CalendarPlus.initCalendar();
		}
	},
    initCalendar:function(){
    	
    	var bWeekends = true;
		if (CalendarPlus.calendarConfig['defaultView'] == 'agendaWorkWeek') {
			bWeekends = false;
		}
	   
		var firstHour = new Date().getUTCHours() + 2;
	
		$("#leftcontent").niceScroll();
		$("#rightCalendarNav").niceScroll();
	
		var monthNames=[
			t(CalendarPlus.appname, 'January'),
			t(CalendarPlus.appname, 'February'),
			t(CalendarPlus.appname, 'March'),
			t(CalendarPlus.appname, 'April'),
			t(CalendarPlus.appname, 'May'),
			t(CalendarPlus.appname, 'June'),
			t(CalendarPlus.appname, 'July'),
			t(CalendarPlus.appname, 'August'),
			t(CalendarPlus.appname, 'September'),
			t(CalendarPlus.appname, 'October'),
			t(CalendarPlus.appname, 'November'),
			t(CalendarPlus.appname, 'December')
		];
		
		var monthNamesShort=[
			t(CalendarPlus.appname, 'Jan.'),
			t(CalendarPlus.appname, 'Feb.'),
			t(CalendarPlus.appname, 'Mar.'),
			t(CalendarPlus.appname, 'Apr.'),
			t(CalendarPlus.appname, 'May.'),
			t(CalendarPlus.appname, 'Jun.'),
			t(CalendarPlus.appname, 'Jul.'),
			t(CalendarPlus.appname, 'Aug.'),
			t(CalendarPlus.appname, 'Sep.'),
			t(CalendarPlus.appname, 'Oct.'),
			t(CalendarPlus.appname, 'Nov.'),
			t(CalendarPlus.appname, 'Dec.')
		];
		
		var dayNames=[
			t(CalendarPlus.appname, 'Sunday'),
			t(CalendarPlus.appname, 'Monday'),
			t(CalendarPlus.appname, 'Tuesday'),
			t(CalendarPlus.appname, 'Wednesday'),
			t(CalendarPlus.appname, 'Thursday'),
			t(CalendarPlus.appname, 'Friday'),
			t(CalendarPlus.appname, 'Saturday')
		];
		
		var dayNamesShort=[
			t(CalendarPlus.appname, 'Sun.'),
			t(CalendarPlus.appname, 'Mon.'),
			t(CalendarPlus.appname, 'Tue.'),
			t(CalendarPlus.appname, 'Wed.'),
			t(CalendarPlus.appname, 'Thu.'),
			t(CalendarPlus.appname, 'Fri.'),
			t(CalendarPlus.appname, 'Sat.')
		];
		
		$('#fullcalendar').fullCalendar({
			header : {
				center : 'title',
				left : '',
				right : ''
			},
			firstDay : CalendarPlus.calendarConfig['firstDay'],
			editable : true,
			defaultView : CalendarPlus.calendarConfig['defaultView'],
			aspectRatio : 1.5,
			weekNumberTitle : t(CalendarPlus.appname, 'CW '),
			weekNumbers : true,
			weekMode : 'variable',
			yearColumns:2,
			monthClickable:true,
			firstHour : firstHour,
			weekends : bWeekends,
			timeFormat : {
				agenda : CalendarPlus.calendarConfig['agendatime'],
				'' : CalendarPlus.calendarConfig['defaulttime']
			},
			columnFormat : {
				month : t(CalendarPlus.appname, 'ddd'), // Mon
				week : t(CalendarPlus.appname, 'ddd M/d'), // Mon 9/7
				agendaThreeDays : t(CalendarPlus.appname, 'dddd M/d'), // Mon 9/7
				day : t(CalendarPlus.appname, 'dddd M/d') // Monday 9/7
			},
			titleFormat : {
				month : t(CalendarPlus.appname, 'MMMM yyyy'),
				// September 2009
				week : t(CalendarPlus.appname, "MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}"),
				// Sep 7 - 13 2009
				day : t(CalendarPlus.appname, 'dddd, MMM d, yyyy'),
				// Tuesday, Sep 8, 2009
			},
			axisFormat : CalendarPlus.calendarConfig['defaulttime'],
			monthNames : monthNames,
			monthNamesShort : monthNamesShort,
			dayNames : dayNames,
			dayNamesShort : dayNamesShort,
			allDayText : t(CalendarPlus.appname, 'All day'),
			viewRender : function(view, element) {
				$("#datepickerNav").datepicker("setDate", $('#fullcalendar').fullCalendar('getDate'));
				
				if (view.name != CalendarPlus.calendarConfig['defaultView']) {
					
					$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/changeviewcalendar'), {
						v : view.name
					});
					CalendarPlus.calendarConfig['defaultView'] = view.name;
				}
				$('.view button').removeClass('active');
				$('.view button[data-action=' + view.name + ']').addClass('active');
				
				if (view.name == 'list') {
					$('.fc-view-list').height($(window).height() - 150);
				}
				if(view.name == 'agendaDay'){
					CalendarPlus.Util.initAddDayView();
					
				}
				if (view.name == 'month' || view.name == 'year' ) {
					
				//	$("#fullcalendar").niceScroll();
				}else{
					//$("#scrollDiv").niceScroll();
				}
				
				
				CalendarPlus.Util.rebuildCalendarDim();
				
				try {
					CalendarPlus.Util.setTimeline();
				} catch(err) {
				}
	
			},
			selectable : true,
			selectHelper : true,
			unselectAuto:false,
			slotMinutes : 15,
			select : CalendarPlus.UI.newEvent,
			eventClick : CalendarPlus.UI.showEvent,
			eventDrop : CalendarPlus.UI.moveEvent,
			eventResize : CalendarPlus.UI.resizeEvent,
			eventRender : CalendarPlus.UI.Events.renderEvents,
			loading : CalendarPlus.UI.loading,
			eventSources : CalendarPlus.calendarConfig['eventSources'],
	
		});
		
		CalendarPlus.Util.rebuildCalView();
		
    },
	Util : {
		showGlobalMessage:function(msg){
			$('#notification').html(msg);
			$('#notification').slideDown();
			window.setTimeout(function(){$('#notification').slideUp();}, 3000);
		},
		Selectable : function(ListSelector, IdReturnField) {
			//var FromDate=$('#from').val().split('-');
			//var fromDay=FromDate[0];
			var logicWD = $('#logicCheckWD').val();
			var InputRadio = '#showOwnDev input[name=radioMonth]';
			var InputCheck = '#showOwnDev input[name=checkMonth]';

			$(ListSelector).each(function(i, el) {
				$(el).on('click', function() {
					var bLogic = true;
					var sFreq = $('#rAdvanced option:selected').val();

					if ((sFreq == 'MONTHLY' && ListSelector == '#rByweekday li') || (sFreq == 'YEARLY' && ListSelector == '#rByweekdayYear li')) {
						if ($(el).data('val') != logicWD) {
							bLogic = false;
						}
					}

					if (!$(el).closest('ul').hasClass('ui-isDisabled') && bLogic === true) {

						if ((sFreq == 'MONTHLY' && $(InputRadio + ':checked').val() == 'onweekday') || (sFreq == 'YEARLY' && $(InputCheck).is(':checked') && ListSelector == '#rByweekdayYear li')) {
							$(ListSelector).removeClass('ui-selected');
							$(this).addClass('ui-selected');
						} else {
							$(this).toggleClass('ui-selected');
							if ($(ListSelector + '.ui-selected').length == 0)
								$(this).addClass('ui-selected');
						}

						// $('#rruleOwnoutput').text(sResultInput);
						//CalendarPlus.Util.rruleToText(sResultInput);
					}
				});
			});
		},
		getrRuleonSubmit : function() {
			var sFreq = $('#rAdvanced option:selected').val();
			var iInterval = $('#rInterval').val();

			var srRule = '';
			if (sFreq == 'DAILY') {
				srRule = 'FREQ=' + sFreq;
			}
			if (sFreq == 'WEEKLY') {
				var sResult = '';
				$('#rByweekdayWeek li.ui-selected').each(function() {
					if (sResult == '')
						sResult = $(this).data('val');
					else {
						sResult += ',' + $(this).data('val');
					}
				});
				srRule = 'FREQ=' + sFreq + ';BYDAY=' + sResult;
			}
			if (sFreq == 'MONTHLY') {
				var sResult = '';
				var sMonthChoose = $('#showOwnDev input[name=radioMonth]:checked').val();
				if (sMonthChoose == 'every') {
					$('#rBymonthday li.ui-selected').each(function() {
						if (sResult == '')
							sResult = $(this).data('val');
						else {
							sResult += ',' + $(this).data('val');
						}
					});
					srRule = 'FREQ=' + sFreq + ';BYMONTHDAY=' + sResult;
				}
				if (sMonthChoose == 'onweekday') {
					var iWeek = $('#weekofmonthoptions option:selected').val();
					$('#rByweekday li.ui-selected').each(function() {
						if (sResult == '')
							sResult = iWeek + $(this).data('val');
						else {
							sResult += ',' + iWeek + $(this).data('val');
						}
					});
					srRule = 'FREQ=' + sFreq + ';BYDAY=' + sResult;
				}
			}
			if (sFreq == 'YEARLY') {
				var sYearChoose = $('#showOwnDev input[name=checkMonth]');
				var sResultMonth = '';
				$('#rBymonth li.ui-selected').each(function() {
					if (sResultMonth == '')
						sResultMonth = $(this).data('val');
					else {
						sResultMonth += ',' + $(this).data('val');
					}
				});
				sResultMonth = ';BYMONTH=' + sResultMonth;

				var sResult = '';
				if (sYearChoose.is(':checked')) {
					var iWeek = $('#weekofmonthoptions option:selected').val();
					$('#rByweekdayYear li.ui-selected').each(function() {
						if (sResult == '')
							sResult = iWeek + $(this).data('val');
						else {
							sResult += ',' + iWeek + $(this).data('val');
						}
					});
					sResult = ';BYDAY=' + sResult;

				}
				srRule = 'FREQ=' + sFreq + sResultMonth + sResult;

			}
			if (Math.floor(iInterval) != iInterval || $.isNumeric(iInterval) == false) {
				iInterval = 1;
			}
			var sRuleReader = CalendarPlus.Util.rruleToText(srRule + ';INTERVAL=' + iInterval);
			$("#rruleoutput").text(sRuleReader);
			$('#lRrule').html('<i style="font-size:12px;" class="ioc ioc-repeat"></i> '+sRuleReader).show();
			$("#sRuleRequest").val(srRule + ';INTERVAL=' + iInterval);

		},
		getReminderonSubmit : function() {
			var sAdvMode = $('#reminderAdvanced option:selected').val();
			var sResult = '';
			if (sAdvMode === 'DISPLAY') {
				var sTimeMode = $('#remindertimeselect option:selected').val();
				//-PT5M
				var rTimeSelect = $('#remindertimeinput').val();

				if (sTimeMode !== 'ondate' && (Math.floor(rTimeSelect) == rTimeSelect && $.isNumeric(rTimeSelect))) {
					var sTimeInput = $('#remindertimeinput').val();
					if (sTimeMode === 'minutesbefore') {
						sResult = '-PT' + sTimeInput + 'M';
					}
					if (sTimeMode == 'hoursbefore') {
						sResult = '-PT' + sTimeInput + 'H';
					}
					if (sTimeMode === 'daysbefore') {
						sResult = '-PT' + sTimeInput + 'D';
					}
					if (sTimeMode === 'weeksbefore') {
						sResult = '-PT' + sTimeInput + 'W';
					}
					if (sTimeMode === 'minutesafter') {
						sResult = '+PT' + sTimeInput + 'M';
					}
					if (sTimeMode === 'hoursafter') {
						sResult = '+PT' + sTimeInput + 'H';
					}
					if (sTimeMode === 'daysafter') {
						sResult = '+PT' + sTimeInput + 'D';
					}
					if (sTimeMode === 'weeksafter') {
						sResult = '+PT' + sTimeInput + 'W';
					}
					sResult = 'TRIGGER:' + sResult;
				}
				if (sTimeMode === 'ondate' && $('#reminderdate').val() !== '') {
					//20140416T065000Z
					var dateTuple = $('#reminderdate').val().split('-');
					var timeTuple = $('#remindertime').val().split(':');

					var day, month, year, minute, hour;
					day = dateTuple[0];
					month = dateTuple[1];
					year = dateTuple[2];
					hour = timeTuple[0];
					minute = timeTuple[1];

					var sDate = year + '' + month + '' + day + 'T' + hour + '' + minute + '00Z';

					sResult = 'TRIGGER;VALUE=DATE-TIME:' + sDate;
				}
				if (sResult !== '') {
					$("#sReminderRequest").val(sResult);
					var sReader = CalendarPlus.Util.reminderToText(sResult);
					$('#reminderoutput').text(sReader);
					$('#lReminder').html(' <i style="font-size:14px;" class="ioc ioc-clock"></i> '+sReader).show();
				
				} else {
					CalendarPlus.UI.reminder('reminderreset');
					alert('Wrong Input!');
				}
			}
			//alert(sResult);

		},
		reminderToText : function(sReminder) {
			if (sReminder != '') {
				
				var sReminderTxt = '';
				if (sReminder.indexOf('-PT') != -1) {
					//before
					var sTemp = sReminder.split('-PT');
					var sTempTF = sTemp[1].substring((sTemp[1].length - 1));
					if (sTempTF == 'M') {
						sReminderTxt = t(CalendarPlus.appname, 'Minutes before');
					}
					if (sTempTF == 'H') {
						sReminderTxt = t(CalendarPlus.appname, 'Hours before');
					}
					if (sTempTF == 'D') {
						sReminderTxt = t(CalendarPlus.appname, 'Days before');
					}
					if (sTempTF == 'W') {
						sReminderTxt = t(CalendarPlus.appname, 'Weeks before');
					}
					var sTime = sTemp[1].substring(0, (sTemp[1].length - 1));
					sReminderTxt = sTime + ' ' + sReminderTxt;
				} else if (sReminder.indexOf('+PT') != -1) {
					var sTemp = sReminder.split('+PT');
					var sTempTF = sTemp[1].substring((sTemp[1].length - 1));
					if (sTempTF == 'M') {
						sReminderTxt = t(CalendarPlus.appname, 'Minutes after');
					}
					if (sTempTF == 'H') {
						sReminderTxt = t(CalendarPlus.appname, 'Hours after');
					}
					if (sTempTF == 'D') {
						sReminderTxt = t(CalendarPlus.appname, 'Days after');
					}
					if (sTempTF == 'W') {
						sReminderTxt = t(CalendarPlus.appname, 'Weeks after');
					}
					var sTime = sTemp[1].substring(0, (sTemp[1].length - 1));
					sReminderTxt = sTime + ' ' + sReminderTxt;
				} else {
					//onDate
					sReminderTxt = t(CalendarPlus.appname, 'on');
					
					var sTemp = sReminder.split('DATE-TIME:');
					var sDateTime = sTemp[1].split('T');
					var sYear = sDateTime[0].substring(0, 4);
					var sDay = sDateTime[0].substring(4, 6);
					var sMonth = sDateTime[0].substring(6, 8);
				    var sHour='';
				    var sMinute='';
				    var sHM='';
				    
				    if(sDateTime.length > 1){
						 sHour = sDateTime[1].substring(0, 2);
						 sMinute = sDateTime[1].substring(2, 4);
						 sHM =  sHour + ':' + sMinute;
					}
					sReminderTxt = sReminderTxt + ' ' + sDay + '.' + sMonth + '.' + sYear + ' ' +sHM;

				}

				return sReminderTxt;
			} else
				return false;
		},
		rruleToText : function(sRule) {

			if (sRule != '' && sRule != undefined) {
				sTemp = sRule.split(';');
				sTemp2 = [];

				$.each(sTemp, function(i, el) {
					sTemp1 = sTemp[i].split('=');
					sTemp2[sTemp1[0]] = sTemp1[1];
				});
				iInterval = sTemp2['INTERVAL'];

				soFreq = t(CalendarPlus.appname, sTemp2['FREQ']);
				if (iInterval > 1) {
					if (sTemp2['FREQ'] == 'DAILY') {
						soFreq = t(CalendarPlus.appname, 'All') + ' ' + iInterval + ' ' + t(CalendarPlus.appname, 'Days');
					}
					if (sTemp2['FREQ'] == 'WEEKLY') {
						soFreq = t(CalendarPlus.appname, 'All') + ' ' + iInterval + ' ' + t(CalendarPlus.appname, 'Weeks');
					}
					if (sTemp2['FREQ'] == 'MONTHLY') {
						soFreq = t(CalendarPlus.appname, 'All') + ' ' + iInterval + ' ' + t(CalendarPlus.appname, 'Months');
					}
					if (sTemp2['FREQ'] == 'YEARLY') {
						soFreq = t(CalendarPlus.appname, 'All') + ' ' + iInterval + ' ' + t(CalendarPlus.appname, 'Years');
					}
					//tmp=soFreq.toString();
					//tmp.split(" ");

					//soFreq=tmp[0]+' '+iInterval+'. '+tmp[1];
				}

				saveMonth = '';
				if (sTemp2['BYMONTH']) {
					sTempBm = sTemp2['BYMONTH'].split(',');
					iCpBm = sTempBm.length;
					$.each(sTempBm, function(i, el) {
						if (saveMonth == '')
							saveMonth = ' im ' + monthNames[(el - 1)];
						else {
							if (iCpBm != (i + 1)) {
								saveMonth += ', ' + monthNames[(el - 1)];
							} else {
								saveMonth += ' ' + t(CalendarPlus.appname, 'and') + ' ' + monthNames[(el - 1)];
							}
						}
					});
				}
				saveMonthDay = '';
				if (sTemp2['BYMONTHDAY']) {
					sTempBmd = sTemp2['BYMONTHDAY'].split(',');
					iCpBmd = sTempBmd.length;
					$.each(sTempBmd, function(i, el) {
						if (saveMonthDay == '')
							saveMonthDay = ' ' + t(CalendarPlus.appname, 'on') + ' ' + el + '.';
						else {
							if (iCpBmd != (i + 1)) {
								saveMonthDay += ', ' + el + '.';
							} else {
								saveMonthDay += ' ' + t(CalendarPlus.appname, 'and') + ' ' + el + '.';
							}
						}
					});
				}

				saveDay = '';
				if (sTemp2['BYDAY']) {
					sTemp3 = sTemp2['BYDAY'].split(',');
					iCpBd = sTemp3.length;
					$.each(sTemp3, function(i, el) {
						var elLength = el.length;
						if (elLength == 2) {
							if (saveDay == '')
								saveDay = ' ' + t(CalendarPlus.appname, 'on') + ' ' + t(CalendarPlus.appname, el);
							else {
								if (iCpBd != (i + 1)) {
									saveDay += ', ' + t(CalendarPlus.appname, el);
								} else {
									saveDay += ' ' + t(CalendarPlus.appname, 'and') + ' ' + t(CalendarPlus.appname, el);
								}
							}
						}
						if (elLength == 3) {
							var week = el.substring(0, 1);
							var day = el.substring(1, 3);
							if (saveDay == '')
								saveDay = ' ' + t(CalendarPlus.appname, 'on') + ' ' + week + '. ' + t(CalendarPlus.appname, day);
							else
								saveDay += ', ' + t(CalendarPlus.appname, day);
						}
						if (elLength == 4) {
							var week = el.substring(1, 2);
							var day = el.substring(2, 4);
							if (saveDay == '')
								saveDay = ' ' + t(CalendarPlus.appname, 'on') + ' ' + week + '. ' + t(CalendarPlus.appname, day);
							else
								saveDay += ', ' + t(CalendarPlus.appname, day);
						}
					});
				}
				//#rruleoutput
				var returnVal = soFreq + saveMonthDay + saveDay + saveMonth;
				return returnVal;
			} else
				return false;
			//alert(soFreq+saveMonthDay+saveDay+saveMonth);
		},
		sendmail : function(eventId, emails) {
			CalendarPlus.UI.loading(true);
			$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/sendemaileventics'), {
				eventId : eventId,
				emails : emails,

			}, function(result) {
				if (result.status == 'success') {
					//Lang
					OC.dialogs.alert('E-Mails an: ' + emails + ' erfolgreich versendet.', 'Email erfolgreich versendet');
					$('#inviteEmails').val('');
				} else {
					OC.dialogs.alert(result.data.message, 'Error sending mail');
				}
				CalendarPlus.UI.loading(false);
			});
		},
		addSubscriber : function(eventId, emails, existAttendees) {
			
			$.ajax({
			type : 'POST',
			url : OC.generateUrl('apps/'+CalendarPlus.appname+'/addsubscriberevent'),
			data :{
				eventId : eventId,
				emails : emails,
				attendees : existAttendees,
			},
			success : function(jsondata) {
				if (jsondata.message == 'sent') {
						//Lang
						OC.dialogs.alert('E-Mails an: ' + emails + ' erfolgreich versendet.', 'Email erfolgreich versendet');
						$('#addSubscriberEmail').val('');
					}
					if (jsondata.message == 'notsent') {
						OC.dialogs.alert('Es wurde keine E-Mail versendet', 'Email nicht versendet');
						$('#addSubscriberEmail').val('');
					}
			}
		});
			
			
		},

		addIconsCal : function(title, src, width) {
			
			//share-alt,repeat,lock,clock-o
			return '<div class="eventIcons"><i title="' + title + '"  class="ioc ioc-' + src + '"></i></div>';
		},
		dateTimeToTimestamp : function(dateString, timeString) {
			dateTuple = dateString.split('-');
			timeTuple = timeString.split(':');

			var day, month, year, minute, hour;
			day = parseInt(dateTuple[0], 10);
			month = parseInt(dateTuple[1], 10);
			year = parseInt(dateTuple[2], 10);
			hour = parseInt(timeTuple[0], 10);
			minute = parseInt(timeTuple[1], 10);

			var date = new Date(year, month - 1, day, hour, minute);

			return parseInt(date.getTime(), 10);
		},

		touchCal : function(EVENTID) {
			$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/touchcalendar'), {
				eventid : EVENTID
			}, function(jsondata) {
				$('#fullcalendar').fullCalendar('refetchEvents');
			});
		},
		getDayOfWeek : function(iDay) {
			var weekArray = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
			return weekArray[iDay];
		},
		formatDate : function(year, month, day) {
			if (day < 10) {
				day = '0' + day;
			}
			if (month < 10) {
				month = '0' + month;
			}
			return day + '-' + month + '-' + year;
		},
		formatTime : function(hour, minute) {
			if (hour < 10) {
				hour = '0' + hour;
			}
			if (minute < 10) {
				minute = '0' + minute;
			}
			return hour + ':' + minute;
		},
		adjustDate : function() {
			var fromTime = $('#fromtime').val();
			var fromDate = $('#from').val();
			var fromTimestamp = CalendarPlus.Util.dateTimeToTimestamp(fromDate, fromTime);

			var toTime = $('#totime').val();
			var toDate = $('#to').val();
			var toTimestamp = CalendarPlus.Util.dateTimeToTimestamp(toDate, toTime);

			if (fromTimestamp >= toTimestamp) {
				fromTimestamp += 30 * 60 * 1000;

				var date = new Date(fromTimestamp);
				movedTime = CalendarPlus.Util.formatTime(date.getHours(), date.getMinutes());
				movedDate = CalendarPlus.Util.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

				$('#to').val(movedDate);
				$('#totime').val(movedTime);
				
			}
		},
		adjustTime : function() {
			var fromTime = $('#fromtime').val();
			var fromDate = $('#from').val();
			var fromTimestamp = CalendarPlus.Util.dateTimeToTimestamp(fromDate, fromTime);
			var toTime = $('#totime').val();
			var toDate = $('#to').val();
			var toTimestamp = CalendarPlus.Util.dateTimeToTimestamp(toDate, toTime);

			if (fromTimestamp >= toTimestamp) {
				fromTimestamp += 30 * 60 * 1000;

				var date = new Date(fromTimestamp);
				movedTime = CalendarPlus.Util.formatTime(date.getHours(), date.getMinutes());

				$('#totime').val(movedTime);
				
			}
		},
		completedTaskHandler : function(event) {
			$Task = $(this).closest('.taskListRow');
			TaskId = $Task.attr('data-taskid');
			checked = $(this).is(':checked');

			$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/setcompletedtaskcalendar'), {
				id : TaskId,
				checked : checked ? 1 : 0
			}, function(jsondata) {
				if (jsondata.status == 'success') {
					task = jsondata.data;
					//$Task.data('task', task)
					$(task).each(function(i,el){
							$task=$('li[data-taskid="'+el.id+'"]');
							$task.addClass('done');
							$task.remove();
					});
					
					
				} else {
					alert(jsondata.data.message);
				}
			});

		},
		rebuildTaskView : function() {
			$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/rebuildtaskviewrightcalendar'), function(data) {

				if (data !== '') {
					$('#rightCalendarNav').html(data);
					$('.inputTasksRow').each(function(i, el) {
						$(el).click(CalendarPlus.Util.completedTaskHandler);
					});
				} else {
					$('#tasknavActive').removeClass('button-info');
					$('#rightCalendarNav').addClass('isHiddenTask');
					$('#rightCalendarNav').html('');
					checkedTask = 'false';
					$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/calendarsettingssettasknavactive'), {
						checked : checkedTask
					});
				}
				CalendarPlus.Util.rebuildCalendarDim();
			});
		},
		rebuildCalView : function() {
			$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/rebuildleftnavigationcalendar'), function(data) {
				
				$('#leftcontent').html(data);
				
				$('.view button.viewaction').each(function(i,el){
						if(CalendarPlus.calendarConfig['userconfig'][$(el).data('action')]=== 'true'){
							$(el).show();
						}else{
							$(el).hide();
						}
					});
				
				CalendarPlus.Util.rebuildCalendarDim();
				CalendarPlus.Util.calViewEventHandler();

				CalendarPlus.UI.buildCategoryList();

				$('#categoryCalendarList').hide();
				$('#showCategory').click(function() {
		
					if (! $('#categoryCalendarList').is(':visible')) {
						$('h3[data-id="lCategory"] i.ioc-angle-down').removeClass('ioc-rotate-270');
						$('#categoryCalendarList').show('fast');
					} else {
						$('#categoryCalendarList').hide('fast');
						$('h3[data-id="lCategory"] i.ioc-angle-down').addClass('ioc-rotate-270');
					}
				});
				
				$('.view.navigation-left button').each(function(i, el) {
					$(el).on('click', function() {
						$('#fullcalendar').show();
						if ($(this).data('view') === false) {
							$('#fullcalendar').fullCalendar($(this).data('action'));
						} else {
			
							$('#fullcalendar').fullCalendar('option', 'weekends', $(this).data('weekends'));
							$('#fullcalendar').fullCalendar('changeView', $(this).data('action'));
			
						}
					});
				});
				
				OC.Share.loadIcons(CalendarPlus.calendarConfig['sharetypecalendar']);
			});
		},
		calViewEventHandler : function() {
			$('.activeCalendarNav').on('change', function(event) {
				event.stopPropagation();

				CalendarPlus.UI.Calendar.activation(this, $(this).data('id'));
			});
			$('.iCalendar').on('click', function(event) {
				if (!$(this).closest('.calListen').hasClass('isActiveCal')) {
					$('.calListen').removeClass('isActiveCal');
					$('.calListen .colCal').removeClass('isActiveUserCal');

					CalId = $(this).closest('.calListen').attr('data-id');
					CalendarPlus.UI.Calendar.choosenCalendar(CalId);
				}

			});
			$('.refreshSubscription').on('click', function(event) {
				CalId = $(this).closest('.calListen').attr('data-id');

				if (CalId != 'birthday_' + oc_current_user) {
					CalendarPlus.UI.Calendar.refreshCalendar(CalId);
				}
			});
			$('.toolTip').tipsy({
				html : true,
				gravity:'nw'
			});

			$("#datepickerNav").datepicker({

				minDate : null,
				firstDay: CalendarPlus.calendarConfig['firstDay'],
				onSelect : function(value, inst) {
					var date = inst.input.datepicker('getDate');

					$('#fullcalendar').fullCalendar('gotoDate', date);

					var view = $('#fullcalendar').fullCalendar('getView');

					if (view.name !== 'month' && view.name !== 'list' && view.name !== 'year') {
						$("[class*='fc-col']").removeClass('activeDay');
						daySel = CalendarPlus.Util.getDayOfWeek(date.getDay());
						$('td.fc-' + daySel).addClass('activeDay');
					}
					if (view.name == 'month' || view.name == 'year') {
						$('td.fc-day').removeClass('activeDay');
						prettyDate = formatDatePretty(date, 'yy-mm-dd');
						$('td[data-date=' + prettyDate + ']').addClass('activeDay');
					}

				}
			});

		},
		rebuildCalendarDim : function() {
			//$(window).trigger("resize");
          $('#fullcalendar').show();
			var addWidth = 0;
			if ($('#rightCalendarNav').width() == 0 && $('#app-navigation').width() > 0) {
				addWidth = 25;
				//alert($('#leftcontent').width())

			}

			var calWidth = ($(window).width()) - ($('#app-navigation').width() + $('#rightCalendarNav').width() + addWidth);
			if ($(window).width() > 768) {

				
				$('#first-group').css({
					'margin-left' : '5px'
				});
				$('#calendarnavActive').show();
				$('#rightCalendarNav').show();
				$('#tasknavActive').show();
				$('#showDayOfMonth').show();
				$('.fc-event-vert').removeClass('bigSize-vert-resize');
				
			} else {
				
				if ($('#app-navigation').hasClass('isHiddenCal')) {
					$('#calendarnavActive').addClass('button-info');
					$('#app-navigation').removeClass('isHiddenCal');

					CalendarPlus.Util.rebuildCalView();
					$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/calendarsettingssetcalendarnavactive'), {
						checked : 'true'
					});
				}
				$('.fc-event-vert').addClass('bigSize-vert-resize');
				$('#calendarnavActive').hide();

				$('#first-group').css({
					'margin-left' : '30px'
				});
				
				calWidth = $(window).width();
				//$('#leftcontentInner').removeClass('addTopLeftContentInner');
				$('#rightCalendarNav').hide();
				$('#tasknavActive').hide();
			}

			if ($('.view button[data-action=agendaDay]').hasClass('active')) {
				calWidth = (calWidth / 2);
				$('#dayMore').width(calWidth - 8);
				$('#dayMore').show();
				$('#datepickerNav').hide();
				
				
				if ($(window).width() > 768) {
					$('#datepickerNav').hide();
					$('#showDayOfMonth').show();
					$('#datepickerDayMore').show();
					$('#DayListMore').removeClass('moveTopDayListMore');
					$('#DayListMore').height($(window).height() - $('#controls').height() - $('#header').height() - 280);
					$('#DayMore').height($(window).height() - $('#controls').height() - $('#header').height()-20);
				} else {
					$('#datepickerNav').show();
					$('#showDayOfMonth').hide();
					$('#datepickerDayMore').hide();
					$('#DayListMore').addClass('moveTopDayListMore');
					
					$('#DayListMore').height($(window).height() - $('#controls').height() - $('#header').height() - 65);
					
					if ($(window).width() < 500) {
						$('#dayMore').width((calWidth * 2));
						$('#fullcalendar').hide();
						
					}
				}

				if ($(window).width() < 1250) {
					$('#showDayOfMonth').hide();
					$('#datepickerDayMore').addClass('datepickerDayMoreWidth');
				} else {
					$('#showDayOfMonth').show();
					$('#datepickerDayMore').removeClass('datepickerDayMoreWidth');
				}
				//alert($('#DayListMore').height());
				
				$("#datepickerDayMore").datepicker("setDate", $('#fullcalendar').fullCalendar('getDate'));
				
			} else {
				$('#dayMore').hide();
				$('#datepickerNav').show();
			}
            $("#fullcalendar").height(($(window).height()-100));
			$('#fullcalendar').width(calWidth-20);
			$('#fullcalendar').fullCalendar('option', 'height', $(window).height() - $('#controls').height() - $('#header').height() - 15);
			
			$('#controls').width($(window).width());
		},
		setTimeline : function() {
			var curTime = new Date();
			if (curTime.getHours() == 0 && curTime.getMinutes() <= 5)// Because I am calling this function every 5 minutes
			{
				// the day has changed
				var todayElem = $(".fc-today");
				todayElem.removeClass("fc-today");
				todayElem.removeClass("fc-state-highlight");

				todayElem.next().addClass("fc-today");
				todayElem.next().addClass("fc-state-highlight");
			}

			var parentDiv = $(".fc-agenda-slots:visible").parent();
			var timeline = parentDiv.children(".timeline");
			if (timeline.length == 0) {//if timeline isn't there, add it
				timeline = $("<hr>").addClass("timeline");
				parentDiv.prepend(timeline);
			}

			var curCalView = $('#fullcalendar').fullCalendar("getView");
			if (curCalView.visStart < curTime && curCalView.visEnd > curTime) {
				timeline.show();
			} else {
				timeline.hide();
			}

			var curSeconds = (curTime.getHours() * 60 * 60) + (curTime.getMinutes() * 60) + curTime.getSeconds();
			var percentOfDay = curSeconds / 86400;
			//24 * 60 * 60 = 86400, # of seconds in a day
			var topLoc = Math.floor(parentDiv.height() * percentOfDay);

			timeline.css("top", topLoc + "px");

		},
		initAddDayView : function() {

			$("#datepickerDayMore").datepicker({
				minDate : null,
				firstDay: CalendarPlus.calendarConfig['firstDay'],
				onSelect : function(value, inst) {
					var date = inst.input.datepicker('getDate');

					$('#fullcalendar').fullCalendar('gotoDate', date);
					$("[class*='fc-col']").removeClass('activeDay');
					daySel = CalendarPlus.Util.getDayOfWeek(date.getDay());
					$('td.fc-' + daySel).addClass('activeDay');

					$('#showDayOfMonth').text(date.getDate());

					var nowDay = $.fullCalendar.formatDate(date, 'yyyy/MM/dd');

					if ($('.eventsDate[data-date="' + nowDay + '"]').length > 0) {

						$('#DayListMore').scrollTo('.eventsDate[data-date="' + nowDay + '"]', 800);
						$('.eventsDate').removeClass('selectedDay');
						$('.eventsDate[data-date="' + nowDay + '"]').addClass('selectedDay');
					}

				}
			});
			//Month Events Needs better Check if cal is active or not

			CalendarPlus.Util.loadDayList(true);
			

		},
		loadDayList : function(reload) {
			
			if ($('.view button[data-action=agendaDay]').hasClass('active')) {
              
				var d = $('#fullcalendar').fullCalendar('getDate');
				var month = d.getMonth();
				var year = d.getFullYear();

				var monthYear = month + '-' + year;

				$('#showDayOfMonth').text(d.getDate());

				//alert(monthYear+':'+$('#eventsList').attr('data-date'));
				if (monthYear != $('#eventsList').attr('data-date') || reload === true) {
					var htmlList = '';
					$('#DayListMore').html('');
					
					$.ajax({
						type : 'POST',
						url : OC.generateUrl('apps/'+CalendarPlus.appname+'/geteventsdayview'),
						data :{
							month : month,
							year : year
						},
						success : function(data) {
							
							var selectedDay = $('#fullcalendar').fullCalendar('getDate');
							var nowDay = $.fullCalendar.formatDate(selectedDay, 'yyyy/MM/dd');

							if (data.sortdate != undefined) {

								$.each(data.sortdate, function(i, elem) {
									//tmpDate=new Date(elem);
									MyDate = $.datepicker.formatDate('DD, dd. MM yy', new Date(elem));

									var AddCssDate = '';
									if (nowDay == elem) {
										AddCssDate = ' selectedDay';
									}
									var dayData = elem;
									htmlList += '<li class="eventsDate' + AddCssDate + '" data-date="' + dayData + '" title="' + dayData + '">' + MyDate + '</li>';
									//$('#datepickerDayMore .ui-state-default').find('text="1"').text();

									if (data.data[elem] != undefined) {
										$.each(data.data[elem], function(it, el) {
											var bgColor = '#D4D5AA';
											var color = '#000000';
											if(el[0]!==undefined){
												if ( typeof CalendarPlus.calendarConfig['calendarcolors'][el[0].calendarid] != 'undefined') {
													bgColor = CalendarPlus.calendarConfig['calendarcolors'][el[0].calendarid]['bgcolor'];
													color = CalendarPlus.calendarConfig['calendarcolors'][el[0].calendarid]['color'];
												}
												var CalDiv = '<span class="colorCal-list" style="margin-top:6px;background-color:' + bgColor + ';">' + '&nbsp;' + '</span>';
												var time = '<span class="timeAgenda">'+t(CalendarPlus.appname,"All day")+'</span>';
	
												if (!el[0].allDay) {
													var time = '<span class="timeAgenda">' + $.fullCalendar.formatDates(new Date(el[0].startlist), new Date(el[0].endlist), 'HH:mm{ - HH:mm}') + '</span>';
												}
												//share-alt,repeat,lock,clock-o,eye
												var repeatIcon = '';
												var dateToLoad = el[0].startlist;
												if (el[0].isrepeating) {
													repeatIcon = CalendarPlus.Util.addIconsCal(t(CalendarPlus.appname, 'Repeat'), 'repeat', '14');
													dateToLoad = dayData;
												}
												var sharedIcon = '';
												if (el[0].shared) {
													sharedIcon = CalendarPlus.Util.addIconsCal(t('core', 'Shared'), 'share', '14');
												}
												var privatIcon = '';
												if (el[0].privat == 'private') {
													privatIcon = CalendarPlus.Util.addIconsCal(t(CalendarPlus.appname, 'Show As'), 'lock', '12');
												}
												if (el[0].privat == 'confidential') {
													privatIcon = CalendarPlus.Util.addIconsCal(t(CalendarPlus.appname, 'Show As'), 'eye', '12');
												}
												var alarmIcon = '';
												if (el[0].isalarm) {
													alarmIcon = CalendarPlus.Util.addIconsCal(t(CalendarPlus.appname, 'Reminder'), 'clock', '14');
												}
												var location = '';
												if (el[0].location) {
													location = '<span class="listLocation">' + el[0].location + '</span>';
												}
												htmlList += '<li class="eventsRow" data-id="' + el[0].id + '" data-date="' + dateToLoad + '">' + time + ' ' + CalDiv + repeatIcon + sharedIcon + privatIcon + alarmIcon + ' ' + el[0].title + location + '</li>';
										}
										});
									}

								});
							}
							if (htmlList != '') {
								htmlList = '<ul id="eventsList" data-date="' + month + '-' + year + '">' + htmlList + '</ul>';
							} else {
								htmlList = '<ul id="eventsList" data-date="' + month + '-' + year + '"><li class="noEventFound">Keine Termine vorhanden</li></ul>';
							}
							$('#DayListMore').html(htmlList);

							$('.eventsDate').on('click', function() {

								$('.eventsDate').removeClass('selectedDay');
								$(this).addClass('selectedDay');
								$('#fullcalendar').fullCalendar('gotoDate', new Date($(this).attr('data-date')));

							});

							$('.eventsRow').on('click', function() {
								$('#fullcalendar').fullCalendar('gotoDate', new Date($(this).attr('data-date')));
								var calEvent = {};
								calEvent['id'] = $(this).attr('data-id');
								var jsEvent = {};
								jsEvent.target = $(this);
								CalendarPlus.UI.showEvent(calEvent,jsEvent, '');

							});
							if ($('.eventsDate[data-date="' + nowDay + '"]').length > 0) {
								$('#DayListMore').scrollTo('.eventsDate[data-date="' + nowDay + '"]', 800);
							}

						}
					});

					
				}
			}
		},
		checkShowEventHash : function() {
			var id = parseInt(window.location.hash.substr(1));
			
			
			if (id) {
				$.getJSON(OC.generateUrl('apps/'+CalendarPlus.appname+'/getquickinfoevent'),
				 { id: id},
				 function(jsondata){
					if(jsondata.status == 'success'){
					 
					if($('.webui-popover').length>0){
						if(CalendarPlus.popOverElem !== null){
							CalendarPlus.popOverElem.webuiPopover('destroy');
							CalendarPlus.popOverElem = null;
							$('#event').remove();
						}
					}
					  CalendarPlus.searchEventId = id;
					  $('#fullcalendar').fullCalendar('changeView','month');
					  var viewObj = $('#fullcalendar').fullCalendar('getView');
					  var start = $.fullCalendar.formatDate(viewObj.start,'yyyyMMdd');
					  var end = $.fullCalendar.formatDate(viewObj.end,'yyyyMMdd');
					  var evdate = $.fullCalendar.parseISO8601(jsondata.data.startdate);
					  var eventdate = $.fullCalendar.formatDate(evdate,'yyyyMMdd');
					  var calEvent = {};
					  var jsEvent = {};
					  if(eventdate >= start && eventdate <= end){
								  calEvent['id'] = CalendarPlus.searchEventId;
								  jsEvent.target = $('.fc-event-inner[data-id="'+calEvent['id']+'"]');	
								  CalendarPlus.UI.showEvent(calEvent,jsEvent, '');
					  }else{
					  	 
					  	 $('#fullcalendar').fullCalendar('gotoDate', evdate);
						window.location.href = '#';
							 	
					  }
					}
				});
			
			}
		},
	},
	UI : {

		loading : function(isLoading) {
			if (isLoading) {
				$('#loading').show();
			} else {
				if (CalendarPlus.firstLoading == true) {
					CalendarPlus.Util.checkShowEventHash();
				}
				$('#loading').hide();
				
				
			}

		},

		timerLock : false,
		openShareDialog : function(url, EventId) {
			
			$("#dialogSmall").html('');
			var selCal = $('<select name="calendar" id="calendarAdd"></select>');
			$.each(CalendarPlus.calendarConfig['mycalendars'], function(i, elem) {
				if(elem['issubscribe'] === 0){
					var option = $('<option value="' + elem['id'] + '">' + elem['name'] + '</option>');
					selCal.append(option);
				}
			});

			$('<p>' + t(CalendarPlus.appname, 'Please choose a calendar') + '</p>').appendTo("#dialogSmall");
			selCal.appendTo("#dialogSmall");

			$("#dialogSmall").dialog({
				resizable : false,
				title : t(CalendarPlus.appname, 'Add Event'),
				width : 350,
				modal : true,
				buttons : [{
					text : t('core', 'Add'),
					click : function() {
						var oDialog = $(this);
						var CalId = $('#calendarAdd option:selected').val();

						$.post(url, {
							'eventid' : EventId,
							'calid' : CalId
						}, function(jsondata) {
							if (jsondata.status == 'success') {
								oDialog.dialog("close");
								$('#event').dialog('destroy').remove();
								$('#fullcalendar').fullCalendar('refetchEvents');
								CalendarPlus.Util.showGlobalMessage(jsondata.msg);
								
							} else {
								alert(jsondata.msg);
							}
						});
					}
				}, {
					text : t(CalendarPlus.appname, 'Cancel'),
					click : function() {
						$(this).dialog("close");
					}
				}],

			});

			return false;
		},
		
		startShowEventDialog : function(targetElem,that) {
		//	CalendarPlus.UI.loading(false);
			
			//$('#fullcalendar').fullCalendar('unselect');

			CalendarPlus.UI.lockTime();
			
			that.getContentElement().css('height','auto');
			
			$('#closeDialog').on('click', function() {
				
				if(OC.Share.droppedDown){
					OC.Share.hideDropDown();
				}
				
				if ($('#haveshareaction').val() == '1') {

					CalendarPlus.Util.touchCal($('#eventid').val());
				}
				CalendarPlus.popOverElem.webuiPopover('destroy');
				CalendarPlus.popOverElem = null;
				$('#event').remove();
				
			});

			
			$('.tipsy').remove();
			
			
			
			var sReminderReader = '';
			$('input.sReminderRequest').each(function(i, el) {
				sRead = CalendarPlus.Util.reminderToText($(this).val());
				if (sReminderReader == ''){
					sReminderReader = sRead;
				}else {
					sReminderReader += '<br />' + sRead;
				}
			});
			$('#reminderoutput').html(sReminderReader);

			var sRuleReader = CalendarPlus.Util.rruleToText($('#sRuleRequest').val());
			$("#rruleoutput").text(sRuleReader);

			//var sReminderReader=CalendarPlus.Util.reminderToText($('#sReminderRequest').val());

			$('.exdatelistrow').each(function(i, el) {

				$(el).on('click', function() {
					CalendarPlus.UI.removeExdate($(el).data('exdate'));
				});
			});

			//CalendarPlus.UI.Share.init();

			$('#sendemailbutton').click(function() {
				if ($('#inviteEmails').val() !== '') {

					CalendarPlus.Util.sendmail($(this).attr('data-eventid'), $('#inviteEmails').val());
				}
			});

			$('#addSubscriber').click(function() {
				if ($('#addSubscriberEmail').val() !== '') {
					var existAttendees = [];
					$('.attendeerow').each(function(i, el) {
						existAttendees[i] = $(el).attr('data-email');
					});
					CalendarPlus.Util.addSubscriber($(this).attr('data-eventid'), $('#addSubscriberEmail').val(), existAttendees);
				}
			});
			
			$('#editEvent-delete-single').on('click', function () {
				CalendarPlus.UI.submitDeleteEventSingleForm($(this).data('link'),targetElem);
			});
			
			$('#showEvent-delete').on('click', function() {
				var delink = $(this).data('link');

				$("#dialogSmall").text(t(CalendarPlus.appname, 'Are you sure?'));

				$("#dialogSmall").dialog({
					resizable : false,
					title : t(CalendarPlus.appname, 'Delete Event')+' "'+$('#event a.share').attr('data-title')+'"',
					width : 300,
					modal : true,
					buttons : [{
						text : t(CalendarPlus.appname, 'No'),
						'class' : 'cancelDialog',
						click : function() {
							$("#dialogSmall").html('');
							$(this).dialog("close");
						}
					}, {
						text : t(CalendarPlus.appname, 'Yes'),
						'class' : 'okDialog',
						click : function() {
							var oDialog = $(this);
							CalendarPlus.UI.submitShowDeleteEventForm(delink,targetElem);
							$("#dialogSmall").html('');
							oDialog.dialog("close");
						}
					}],
				});
				return false;
			});

			$('#editEvent-add').on('click', function() {
				CalendarPlus.UI.openShareDialog($(this).data('link'), $('#eventid').val());
			});

			$('#editEventButton').on('click', function() {
				if(OC.Share.droppedDown){
					OC.Share.hideDropDown();
				}
				var calEvent = {};
				calEvent['id'] = $('#eventid').val();
				calEvent['start'] = $('#choosendate').val();
				//alert($('#eventid').val());
				var jsEvent = {};
				jsEvent.target=targetElem;
				CalendarPlus.UI.editEvent(calEvent, jsEvent, CalendarPlus.calendarConfig['defaultView']);
				return false;
			});

			$("#showLocation").tooltip({
				items : "img, [data-geo], [title]",
				position : {
					my : "left+15 center",
					at : "right center"
				},
				content : function() {
					var element = $(this);
					if (element.is("[data-geo]")) {
						var text = element.text();
						return "<img class='map' alt='" + text + "' src='http://maps.google.com/maps/api/staticmap?" + "zoom=14&size=350x350&maptype=terrain&sensor=false&center=" + text + "'>";
					}
					if (element.is("[title]")) {
						return element.attr("title");
					}
					if (element.is("img")) {
						return element.attr("alt");
					}
				}
			});
			OC.Share.loadIcons(CalendarPlus.calendarConfig['sharetypeevent']);
			
			return false;
		},
		startEventDialog : function(targetElem,that, calEvent) {
	
			CalendarPlus.UI.lockTime();
			
			that.getContentElement().css('height','auto');

			if ($('#submitNewEvent').length == 0) {
				$('#editEvent-submit').on('click', function () {
					CalendarPlus.UI.validateEventForm($(this).data('link'),targetElem, calEvent);
				});
				
				$('#editEvent-delete-single').on('click', function () {
					CalendarPlus.UI.submitDeleteEventSingleForm($(this).data('link'),targetElem);
				});
			
				var sRule = CalendarPlus.Util.rruleToText($("#sRuleRequest").val());
				if (sRule != ''){
					$("#rruleoutput").text(sRule);
					$("#lRrule").html('<i style="font-size:12px;" class="ioc ioc-repeat"></i> '+sRule);
					$('#linfoRepeatReminder').hide();
				}
				
				var sReminder = CalendarPlus.Util.reminderToText($("#sReminderRequest").val());
				
				if (sReminder !== false && sReminder !== ''){
					$("#reminderoutput").text(sReminder);
					$("#lReminder").html('<i style="font-size:14px;" class="ioc ioc-clock"></i> '+sReminder);
					$('#linfoRepeatReminder').hide();
				}
				
				$('#accordion span.ioc-checkmark').hide();
				if($('#event_form input[name="link"]').val() !== ''){
					$('#accordion span.lurl').show();
				}
				if($('#event_form textarea[name="description"]').val() !== ''){
					$('#accordion span.lnotice').show();
				}
				if($('#event_form input[name="categories"]').val() !== ''){
					$('#accordion span.ltag').show();
				}
				
				OC.Share.loadIcons(CalendarPlus.calendarConfig['sharetypeevent']);
			}else {
				
				$('#submitNewEvent').on('click', function () {
					CalendarPlus.UI.validateEventForm($(this).data('link'),targetElem, calEvent);
				});
				
				$('#rEndRepeat').hide();
				$('#rEndRepeatOutput').hide();
				$('#accordion span.ioc-checkmark').hide();
				$('#event-title').bind('keydown', function(event){
					if (event.which == 13){
						CalendarPlus.UI.validateEventForm($('#submitNewEvent').data('link'),targetElem);
					}
				});
				
			}
			
			$('#closeDialog').on('click', function() {
				CalendarPlus.popOverElem.webuiPopover('destroy');
				CalendarPlus.popOverElem = null;
				if(OC.Share.droppedDown){
					OC.Share.hideDropDown();
				}
				$('#fullcalendar').fullCalendar('unselect');
				if($("#dialogSmall").is(':visible')){
					$("#dialogSmall").dialog('close');
				}
				if ($('#haveshareaction').val() == '1') {
					CalendarPlus.Util.touchCal($('#eventid').val());
				}
				
			});

            $( "#accordion" ).accordion({
		      collapsible: true,
		      heightStyle: "content",
		      active: false,
		      animate:false
		    });
             
             
			$('#editEvent-delete').on('click', function() {
				var delink = $(this).data('link');

				$("#dialogSmall").html(t(CalendarPlus.appname, 'Are you sure?'));

				$("#dialogSmall").dialog({
					resizable : false,
					title : t(CalendarPlus.appname, 'Delete Event')+' "'+$('#event a.share').attr('data-title')+'"',
					width : 300,
					modal : true,
					buttons : [{
						text : t(CalendarPlus.appname, 'No'),
						'class' : 'cancelDialog',
						click : function() {
							$(this).dialog("close");
						}
					}, {
						text : t(CalendarPlus.appname, 'Yes'),
						'class' : 'okDialog',
						click : function() {
							//alert(delink);
							
							var oDialog = $(this);
							CalendarPlus.UI.submitDeleteEventForm(delink);
							oDialog.dialog("close");
							
						}
					}],
				});
				
				return false;

			});
			//INIT
			var FromTime = $('#fromtime').val().split(':');
			$('#from').datetimepicker({
				altField : '#fromtime',
				dateFormat : 'dd-mm-yy',
				timeOnlyTitle: t(CalendarPlus.appname,'Choose Time'),
				timeText: t(CalendarPlus.appname,'Time'),
				hourText: t(CalendarPlus.appname,'Hour'),
				minuteText: t(CalendarPlus.appname,'Minute'),
				secondText: t(CalendarPlus.appname,'Second'),
				firstDay: CalendarPlus.calendarConfig['firstDay'],
				stepMinute : 5,
				minDate : null,
				numberOfMonths : 1,
				hour : FromTime[0],
				minute : FromTime[1],
				addSliderAccess : true,
				sliderAccessArgs : {
					touchonly : false
				},
				showButtonPanel : false,
				onClose : function(dateText, inst) {
					if ($('#to').val() != '') {
						var testStartDate = $('#from').datetimepicker('getDate');
						var testEndDate = $('#to').datetimepicker('getDate');

						if (testStartDate > testEndDate) {
							$('#to').datetimepicker('setDate', $('#from').datetimepicker('getDate'));
						}
					} else {
						$('#to').val(dateText);
					}
					CalendarPlus.Util.adjustTime();
					var startDateTxt=$.datepicker.formatDate('dd.mm.yy',$('#from').datetimepicker('getDate'));
					var toDateTxt=$.datepicker.formatDate('dd.mm.yy',$('#to').datetimepicker('getDate'));
					CalendarPlus.UI.setDateTimeLabelonEvent(startDateTxt,toDateTxt);
				},
				onSelect : function(selectedDateTime) {
					//$('#to').datetimepicker('option', 'minDateTime', $('#from').datetimepicker('getDate'));
					
				}
			});
			
			
			
			var ToTime = $('#totime').val().split(':');
			$('#to').datetimepicker({
				altField : '#totime',
				firstDay: CalendarPlus.calendarConfig['firstDay'],
				dateFormat : 'dd-mm-yy',
				stepMinute : 5,
				numberOfMonths : 1,
				hour : ToTime[0],
				minute : ToTime[1],
				minDate : null,
				timeOnlyTitle: t(CalendarPlus.appname,'Choose Time'),
				timeText: t(CalendarPlus.appname,'Time'),
				hourText: t(CalendarPlus.appname,'Hour'),
				minuteText: t(CalendarPlus.appname,'Minute'),
				secondText: t(CalendarPlus.appname,'Second'),
				addSliderAccess : true,
				sliderAccessArgs : {
					touchonly : false
				},
				showButtonPanel : false,
				onClose : function(dateText, inst) {

					if ($('#from').val() != '') {
						var testStartDate = $('#from').datetimepicker('getDate');

						var testEndDate = $('#to').datetimepicker('getDate');
						if (testStartDate > testEndDate){
							$('#from').datetimepicker('setDate', testEndDate);
						}
					} else {
						$('#from').val(dateText);
					}
					
					CalendarPlus.Util.adjustTime();
					var startDateTxt=$.datepicker.formatDate('dd.mm.yy',$('#from').datetimepicker('getDate'));
					var toDateTxt=$.datepicker.formatDate('dd.mm.yy',$('#to').datetimepicker('getDate'));
					CalendarPlus.UI.setDateTimeLabelonEvent(startDateTxt,toDateTxt);
					
				},
				onSelect : function(selectedDateTime) {
					//alert($('#from').datetimepicker('getDate'));
					//$('#from').datetimepicker('option', 'maxDate', $('#to').datetimepicker('getDate'));
					
				}
			});
			//INIT
			
			var startDateTxt=$.datepicker.formatDate('dd.mm.yy',$('#from').datetimepicker('getDate'));
			var toDateTxt=$.datepicker.formatDate('dd.mm.yy',$('#to').datetimepicker('getDate'));
			CalendarPlus.UI.setDateTimeLabelonEvent(startDateTxt,toDateTxt);
			
			
			//Reminder
			$('#reminderdate').datetimepicker({
				altField : '#remindertime',
				dateFormat : 'dd-mm-yy',
				stepMinute : 5,
				numberOfMonths : 1,
				timeOnlyTitle: t(CalendarPlus.appname,'Choose Time'),
				timeText: t(CalendarPlus.appname,'Time'),
				hourText: t(CalendarPlus.appname,'Hour'),
				minuteText: t(CalendarPlus.appname,'Minute'),
				secondText: t(CalendarPlus.appname,'Second'),
				addSliderAccess : true,
				sliderAccessArgs : {
					touchonly : false
				},
				showButtonPanel : false
			});

			CalendarPlus.UI.reminder('init');
			
			$('#reminderAdvanced').change(function() {
				CalendarPlus.UI.reminder('reminder');
			});
			$('#remindertimeselect').change(function() {
				CalendarPlus.UI.reminder('remindertime');
			});
             /*
			$('#category').multiple_autocomplete({
				source : categoriesSel
			});*/
				aExitsTags=false;
				if($('#categories').val()!=''){
					var sExistTags = $('#categories').val();
					var aExitsTags = sExistTags.split(",");
				}
				
				$('#tagmanager').tagit({
					tagSource : CalendarPlus.calendarConfig['categories'],
					maxTags : 4,
					initialTags : aExitsTags,
					allowNewTags : false,
					placeholder :t(CalendarPlus.appname, 'Add Tags'),
				});

			//INIT
			var sCalendarSel = '#sCalSelect.combobox';
			$(sCalendarSel + ' ul').hide();
			if ($(sCalendarSel + ' li').hasClass('isSelected')) {
				$(sCalendarSel + ' .selector').html('<span class="colCal" style="width:26px;height:26px;margin-top:5px;cursor:pointer;float:none;background-color:' + $(sCalendarSel + ' li.isSelected').data('color') + '">&nbsp;<span>');
			}
			$(sCalendarSel + ' .selector').on('click', function() {
				if ($(sCalendarSel + ' ul').is(':visible')) {
					$(sCalendarSel + ' ul').slideUp();
				} else {
					$(sCalendarSel + ' ul').slideDown();
				}
			});
			$(sCalendarSel + ' li').click(function() {
				$(this).parents(sCalendarSel).find('.selector').html('<span class="colCal" style="width:26px;height:26px;margin-top:5px;float:none;background-color:' + $(this).data('color') + '">&nbsp;<span>');
				$(sCalendarSel + ' li .colCal').removeClass('isSelectedCheckbox');
				$(sCalendarSel + ' li').removeClass('isSelected');
				$('#hiddenCalSelection').val($(this).data('id'));
				$(this).addClass('isSelected');
				$(this).find('.colCal').addClass('isSelectedCheckbox');
				$(sCalendarSel + ' ul').hide();
				if($('.fc-select-helper').length ===1){
					$('.fc-select-helper').css({
						'background-color': CalendarPlus.calendarConfig['calendarcolors'][$(this).data('id')]['bgcolor'],
						'border-color': CalendarPlus.calendarConfig['calendarcolors'][$(this).data('id')]['bgcolor'],
						'color': CalendarPlus.calendarConfig['calendarcolors'][$(this).data('id')]['color'],
						'opacity':1
					});
				}
			});
			//ENDE

			//sRepeatSelect
			var sRepeaterSel = '#sRepeatSelect.combobox';
			$(sRepeaterSel + ' ul').hide();
			if ($(sRepeaterSel + ' li').hasClass('isSelected')) {
				$(sRepeaterSel + ' .selector').html($(sRepeaterSel + ' li.isSelected').text());
				
				if ($(sRepeaterSel + ' li.isSelected').data('id') != 'doesnotrepeat') {
					$('#rEndRepeat').show();
					$('#rEndRepeatOutput').show();
				}else{
					$('#rEndRepeat').hide();
						$('#rEndRepeatOutput').hide();
				}
			}
			$(sRepeaterSel + ' .comboSelHolder').on('click', function() {
				$(sRepeaterSel + ' ul').toggle();
			});
			$(sRepeaterSel + ' li').click(function() {
				$(sRepeaterSel + ' li .colCal').removeClass('isSelectedCheckbox');
				$(sRepeaterSel + ' li').removeClass('isSelected');
				$('#repeat').val($(this).data('id'));
				if ($(this).data('id') == 'OWNDEF') {
					$('#showOwnDev').show();
					$('#rEndRepeat').show();
					$('#rEndRepeatOutput').show();
				} else {
					$('#sRuleRequest').val('FREQ=' + $(this).data('id') + ';INTERVAL=1');
					$("#rruleoutput").text('');
					$('#rEndRepeat').show();
					$('#linfoRepeatReminder').hide();
					var sRuleReader = CalendarPlus.Util.rruleToText($('#sRuleRequest').val());
					$('#lRrule').html('<i style="font-size:12px;" class="ioc ioc-repeat"></i> '+sRuleReader).show();
					//$('#rEndRepeatOutput').show();
				}
				if ($(this).data('id') == 'doesnotrepeat') {
					$('#rEndRepeat').hide();
					$('#rEndRepeatOutput').hide();
					$('#lRrule').hide();
					if(!$('#lReminder').is(':visible')){
						$('#linfoRepeatReminder').show();
					}
				}
				$(this).addClass('isSelected');
				$(this).parents(sRepeaterSel).find('.selector').html($(this).text());
				$(this).find('.colCal').addClass('isSelectedCheckbox');
				$(sRepeaterSel + ' ul').hide();
			});

			//sRepeatSelect
			var sReminderSel = '#sReminderSelect.combobox';
			$(sReminderSel + ' ul').hide();
			if ($(sReminderSel + ' li').hasClass('isSelected')) {
				$(sReminderSel + ' .selector').html($(sReminderSel + ' li.isSelected').text());
				if ($(sReminderSel + ' li.isSelected').data('id') != 'OWNDEF') {
					$('#reminderTrOutput').hide();
				}
			}
			$(sReminderSel + ' .comboSelHolder').on('click', function() {
				$(sReminderSel + ' ul').toggle();
			});
			$(sReminderSel + ' li').click(function() {
				$(sReminderSel + ' li .colCal').removeClass('isSelectedCheckbox');
				$(sReminderSel + ' li').removeClass('isSelected');
				$('#reminder').val($(this).data('id'));
				if ($(this).data('id') == 'OWNDEF') {
					$('#showOwnReminderDev').show();
					$('#reminderTrOutput').show();
				} else if($(this).data('id') != 'none') {
					$('#sReminderRequest').val('TRIGGER:' + $(this).data('id'));
					$('#reminderTrOutput').hide();
					$('#linfoRepeatReminder').hide();
					var sReminderReader = CalendarPlus.Util.reminderToText($('#sReminderRequest').val());
					$('#lReminder').html(' <i style="font-size:14px;" class="ioc ioc-clock"></i> '+sReminderReader).show();
				}	else {
					if($(this).data('id') == 'none'){
						$('#reminderTrOutput').hide();
						$('#lReminder').hide();
						if(!$('#lRrule').is(':visible')){
						$('#linfoRepeatReminder').show();
					}
					}
				}
				$(this).addClass('isSelected');
				$(this).parents(sReminderSel).find('.selector').html($(this).text());
				$(this).find('.colCal').addClass('isSelectedCheckbox');
				$(sReminderSel + ' ul').hide();
			});

			CalendarPlus.UI.repeat('init');
			$('#end').change(function() {
				CalendarPlus.UI.repeat('end');
			});
			$('#rAdvanced').change(function() {
				CalendarPlus.UI.repeat('repeat');
			});

			
	
			$('.tipsy').remove();
			

			$('#sendemailbutton').click(function() {
				CalendarPlus.Util.sendmail($(this).attr('data-eventid'));
			});
			
			
			return true;
		},
		newEvent : function(start, end, allday, jsEvent) {
			
			
			var calId = CalendarPlus.calendarConfig['choosenCalendar'];
			$('.fc-select-helper').css({
				'background-color': CalendarPlus.calendarConfig['calendarcolors'][calId]['bgcolor'],
				'border-color': CalendarPlus.calendarConfig['calendarcolors'][calId]['bgcolor'],
				'color': CalendarPlus.calendarConfig['calendarcolors'][calId]['color'],
				'opacity':1,
			});
			
			start = Math.round(start.getTime() / 1000);
			if (end) {
				end = Math.round(end.getTime() / 1000);
			}
			
			if($('.webui-popover').length>0){
				if(CalendarPlus.popOverElem !== null){
					CalendarPlus.popOverElem.webuiPopover('destroy');
					CalendarPlus.popOverElem = null;
					$('#event').remove();
				}
			}
			CalendarPlus.popOverElem = $(jsEvent.target); 	
			
			CalendarPlus.popOverElem.webuiPopover({
				url:OC.generateUrl('apps/'+CalendarPlus.appname+'/getnewformevent'),
				async:{
					type:'GET',
					data:{
						start : start,
						end : end,
						allday : allday ? 1 : 0
					},
					success:function(that,data){
						that.displayContent();
						CalendarPlus.UI.startEventDialog(CalendarPlus.popOverElem,that);
						
					}
				},
				multi:false,
				closeable:false,
				cache:false,
				placement:'auto-left-right',
				type:'async',
				width:400,
				animation:'pop',
				height:250,
				trigger:'manual',
			}).webuiPopover('show');
				
					
			return false;
			
			//}
		},
		showEvent : function(calEvent, jsEvent, view) {
			
			var id = calEvent.id;
			var choosenDate = '';
			if ( typeof calEvent.start != 'undefined') {
				choosenDate = Math.round(calEvent.start.getTime() / 1000);
			}
			
			if($('.webui-popover').length>0){
				if(CalendarPlus.popOverElem !== null){
					CalendarPlus.popOverElem.webuiPopover('destroy');
					CalendarPlus.popOverElem = null;
					$('#event').remove();
				}
			}
			
			CalendarPlus.popOverElem=$(jsEvent.target);
			var triggerClick = 'click';
			if( CalendarPlus.searchEventId !== null){
				triggerClick = 'manual';
				CalendarPlus.searchEventId = null;
				window.location.href = '#';
			}
			CalendarPlus.popOverElem.webuiPopover({
				url:OC.generateUrl('apps/'+CalendarPlus.appname+'/getshowevent'),
				
				async:{
					type:'POST',
					data:{
						id : id,
						choosendate : choosenDate
					},
					success:function(that,data){
						that.displayContent();
					
						CalendarPlus.UI.startShowEventDialog(CalendarPlus.popOverElem,that);
						
						return false;
					}
				},
				multi:false,
				closeable:false,
				animation:'pop',
				placement:'auto-left-right',
				cache:false,
				type:'async',
				width:400,
				height:50,
				trigger:triggerClick
			}).webuiPopover('show');
			
			
				
			//}
		},

		editEvent : function(calEvent, jsEvent, view) {

			var choosenDate = calEvent.start;
			/*
			 if (calEvent.editable == false || calEvent.source.editable == false) {
			 return;
			 }*/
			var id = calEvent.id;
			
			if($('.webui-popover').length>0){
				if(CalendarPlus.popOverElem !== null){
					CalendarPlus.popOverElem.webuiPopover('destroy');
					CalendarPlus.popOverElem = null;
					$('#event').remove();
				}
			}
			if(view === 'list'){
				CalendarPlus.popOverElem = $(jsEvent.target);
			}else{
				CalendarPlus.popOverElem = $(jsEvent.target);
				
			}
			
			CalendarPlus.popOverElem.webuiPopover({
				url:OC.generateUrl('apps/'+CalendarPlus.appname+'/geteditformevent'),
				async:{
					type:'GET',
					data:{
						id : id,
						choosendate : choosenDate
					},
					success:function(that,data){
						that.displayContent();
						CalendarPlus.UI.startEventDialog(CalendarPlus.popOverElem,that,calEvent);
					}
				},
				multi:false,
				closeable:false,
				cache:false,
				type:'async',
				placement:'auto-left-right',
				width:460,
				height:250,
				trigger:'manual',
			}).webuiPopover('show');
			
			
			//}
		},
		submitDeleteEventForm : function(url) {
			var id = $('input[name="id"]').val();

			$("#errorbox").css('display', 'none').empty();
			
			$.ajax({
				type : 'POST',
				url : url,
				data :{
					id :id,
				},
				success : function(jsondata) {
					$('#fullcalendar').fullCalendar('removeEvents', id);
					CalendarPlus.UI.timerLock = true;
					CalendarPlus.popOverElem.webuiPopover('destroy');
					CalendarPlus.popOverElem = null;
				}
			});
			
		},
		submitShowDeleteEventForm : function(url,targetElem) {
			var id = $('input[name="eventid"]').val();

			$("#errorbox").css('display', 'none').empty();
			//CalendarPlus.UI.loading(true);
			$.ajax({
				type : 'POST',
				url : url,
				data :{
					id :id,
				},
				success : function(jsondata) {
					//CalendarPlus.UI.loading(false);
					targetElem.webuiPopover('destroy');
					$('#fullcalendar').fullCalendar('removeEvents', id);
					
						CalendarPlus.UI.timerLock = true;
						CalendarPlus.Util.loadDayList(true);
				}
			});
			
		},
		submitDeleteEventSingleForm : function(url, targetElem) {

			var id = $('#eventid').val();
			
			var choosenDate = $('#choosendate').val();
			var allDay = $('input[name="allday"]').is(':checked');
			var viewObj = $('#fullcalendar').fullCalendar('getView');
	
			$("#errorbox").css('display', 'none').empty();
			//CalendarPlus.UI.loading(true);
			$.ajax({
				type : 'POST',
				url : url,
				data :{
					id :id,
					choosendate : choosenDate,
					allday : allDay,
					viewstart: viewObj.start,
					viewend: viewObj.end
				},
				success : function(jsondata) {
				//	CalendarPlus.UI.loading(false);
					targetElem.webuiPopover('destroy');
					var current_event_id = jsondata.data.id;
					var updateEvents = jsondata.data.events;
					
					$('#fullcalendar').fullCalendar('removeEvents', current_event_id);
					
					var current_event = {};
					
					$.each(updateEvents,function(i,elem){
						current_event[i] = {};
						
						current_event[i].id = elem.id;
						current_event[i].title = elem.title;
						current_event[i].backgroundColor = CalendarPlus.calendarConfig['calendarcolors'][elem.calendarid]['bgcolor'];
						current_event[i].borderColor  = CalendarPlus.calendarConfig['calendarcolors'][elem.calendarid]['bgcolor'];
						current_event[i].textColor   = CalendarPlus.calendarConfig['calendarcolors'][elem.calendarid]['color'];
						current_event[i].start = $.fullCalendar.parseISO8601(elem.start);
						current_event[i].end = $.fullCalendar.parseISO8601(elem.end);
						current_event[i].lastmodified = elem.lastmodified;
						current_event[i].categories = elem.categories;
						current_event[i].calendarid = elem.calendarid;
						current_event[i].bday = elem.bday;
						current_event[i].shared = elem.shared;
						current_event[i].orgevent = elem.orgevent;
						current_event[i].privat = elem.privat;
						current_event[i].isrepeating = elem.isrepeating;
						current_event[i].isalarm = elem.isalarm;
						current_event[i].allDay = elem.allDay;
						$('#fullcalendar').fullCalendar('renderEvent', current_event[i], false);
					});
					
					
					//$('#fullcalendar').fullCalendar('refetchEvents');
					//$('#event').dialog('destroy').remove();
					CalendarPlus.UI.timerLock = true;
					CalendarPlus.Util.loadDayList(true);
				}
			});
			
			

		},
		removeExdate : function(choosenDate) {

			var id = $('#eventid').val();
			var viewObj = $('#fullcalendar').fullCalendar('getView');
			$.ajax({
				type : 'POST',
				url : OC.generateUrl('apps/'+CalendarPlus.appname+'/deleteexdateevent'),
				data :{
					id : id,
					choosendate : choosenDate,
					viewstart: viewObj.start,
					viewend: viewObj.end
				},
				success : function(jsondata) {
					$('li.exdatelistrow[data-exdate=' + choosenDate + ']').remove();
					var current_event_id = jsondata.data.id;
					var updateEvents = jsondata.data.events;
					
					$('#fullcalendar').fullCalendar('removeEvents', current_event_id);
					
					var current_event = {};
					
					$.each(updateEvents,function(i,elem){
						current_event[i] = {};
						
						current_event[i].id = elem.id;
						current_event[i].title = elem.title;
						current_event[i].backgroundColor = CalendarPlus.calendarConfig['calendarcolors'][elem.calendarid]['bgcolor'];
						current_event[i].borderColor  = CalendarPlus.calendarConfig['calendarcolors'][elem.calendarid]['bgcolor'];
						current_event[i].textColor   = CalendarPlus.calendarConfig['calendarcolors'][elem.calendarid]['color'];
						current_event[i].start = $.fullCalendar.parseISO8601(elem.start);
						current_event[i].end = $.fullCalendar.parseISO8601(elem.end);
						current_event[i].lastmodified = elem.lastmodified;
						current_event[i].categories = elem.categories;
						current_event[i].calendarid = elem.calendarid;
						current_event[i].bday = elem.bday;
						current_event[i].shared = elem.shared;
						current_event[i].orgevent = elem.orgevent;
						current_event[i].privat = elem.privat;
						current_event[i].isrepeating = elem.isrepeating;
						current_event[i].isalarm = elem.isalarm;
						current_event[i].allDay = elem.allDay;
						$('#fullcalendar').fullCalendar('renderEvent', current_event[i], false);
					});
				}
			});

			

		},

		validateEventForm : function(url,targetElem, calEvent) {
			
			var string = '';
						var objTags = $('#tagmanager').tagit('tags');
						$(objTags).each(function(i, el) {
							if (string == '') {
								string = el.value;
							} else {
								string += ',' + el.value;
							}
						});
						$('#categories').val(string);
						var viewObj = $('#fullcalendar').fullCalendar('getView');
						$('#viewstart').val(viewObj.start);
						$('#viewend').val(viewObj.end);
					
			var post = $("#event_form").serialize();
			$("#errorbox").css('display', 'none').empty();
			//CalendarPlus.UI.loading(true);
			$.post(url, post, function(data) {
				CalendarPlus.UI.loading(false);
				
				if (data.status == "error") {

					var output = t(CalendarPlus.appname,'Missing or invalid fields') + ": <br />";

					if (data.title == "true") {
						output = output + t(CalendarPlus.appname,'Title') + "<br />";
					}
					if (data.cal == "true") {
						output = output +  t(CalendarPlus.appname,'Calendar') + "<br />";
					}
					if (data.from == "true") {
						output = output + t(CalendarPlus.appname,'From Date') + "<br />";
					}
					if (data.fromtime == "true") {
						output = output +  t(CalendarPlus.appname,'From Time') + "<br />";
					}
					if (data.to == "true") {
						output = output +  t(CalendarPlus.appname,'To Date') + "<br />";
					}
					if (data.totime == "true") {
						output = output + t(CalendarPlus.appname,'To Time') + "<br />";
					}
					if (data.endbeforestart == "true") {
						output = output +  t(CalendarPlus.appname,'The event ends before it starts') + "!<br/>";
					}
					if (data.dberror == "true") {
						output = t(CalendarPlus.appname,'There was a database fail');
					}
					$("#errorbox").css('display', 'block').html(output);
				} else if (data.status == 'success') {
					targetElem.webuiPopover('destroy');
					$('#fullcalendar').fullCalendar('unselect');
					var current_event_id = data.data.id;
					var updateEvents = data.data.events;
					
					$('#fullcalendar').fullCalendar('removeEvents', current_event_id);
					
					var current_event = {};
					
					$.each(updateEvents,function(i,elem){
						current_event[i] = {};
						
						current_event[i].id = elem.id;
						current_event[i].title = elem.title;
						current_event[i].backgroundColor = CalendarPlus.calendarConfig['calendarcolors'][elem.calendarid]['bgcolor'];
						current_event[i].borderColor  = CalendarPlus.calendarConfig['calendarcolors'][elem.calendarid]['bgcolor'];
						current_event[i].textColor   = CalendarPlus.calendarConfig['calendarcolors'][elem.calendarid]['color'];
						current_event[i].start = $.fullCalendar.parseISO8601(elem.start);
						current_event[i].end = $.fullCalendar.parseISO8601(elem.end);
						current_event[i].lastmodified = elem.lastmodified;
						current_event[i].categories = elem.categories;
						current_event[i].calendarid = elem.calendarid;
						current_event[i].bday = elem.bday;
						current_event[i].shared = elem.shared;
						current_event[i].orgevent = elem.orgevent;
						current_event[i].privat = elem.privat;
						current_event[i].isrepeating = elem.isrepeating;
						current_event[i].isalarm = elem.isalarm;
						current_event[i].allDay = elem.allDay;
						$('#fullcalendar').fullCalendar('renderEvent', current_event[i], false);
					});
					//$('#fullcalendar').fullCalendar('updateEvent', current_event);
					
					CalendarPlus.Util.loadDayList(true);

					CalendarPlus.UI.timerLock = true;
				}
			}, "json");
		},
		addCategory : function(iId, category) {
			
			var viewObj = $('#fullcalendar').fullCalendar('getView');
			
			$.ajax({
			type : 'POST',
			url : OC.generateUrl('apps/'+CalendarPlus.appname+'/addcategorietoevent'),
			data :{
				id : iId,
				category : category,
				viewstart: viewObj.start,
				viewend: viewObj.end
			},
			success : function(jsondata) {
				if(jsondata.status == 'success'){
				//	CalendarPlus.UI.loading(false);
					$('.tipsy').remove();
					var current_event_id = jsondata.data.id;
					var updateEvents = jsondata.data.events;
					
					$('#fullcalendar').fullCalendar('removeEvents', current_event_id);
					
					var current_event = {};
					
					$.each(updateEvents,function(i,elem){
						current_event[i] = {};
						current_event[i].id = elem.id;
						current_event[i].title = elem.title;
						current_event[i].backgroundColor = CalendarPlus.calendarConfig['calendarcolors'][elem.calendarid]['bgcolor'];
						current_event[i].borderColor  = CalendarPlus.calendarConfig['calendarcolors'][elem.calendarid]['bgcolor'];
						current_event[i].textColor   = CalendarPlus.calendarConfig['calendarcolors'][elem.calendarid]['color'];
						current_event[i].start = $.fullCalendar.parseISO8601(elem.start);
						current_event[i].end = $.fullCalendar.parseISO8601(elem.end);
						current_event[i].lastmodified = elem.lastmodified;
						current_event[i].categories = elem.categories;
						current_event[i].calendarid = elem.calendarid;
						current_event[i].bday = elem.bday;
						current_event[i].shared = elem.shared;
						current_event[i].orgevent = elem.orgevent;
						current_event[i].privat = elem.privat;
						current_event[i].isrepeating = elem.isrepeating;
						current_event[i].isalarm = elem.isalarm;
						current_event[i].allDay = elem.allDay;
						$('#fullcalendar').fullCalendar('renderEvent', current_event[i], false);
					});
				}else{
					//CalendarPlus.UI.loading(false);
					CalendarPlus.Util.showGlobalMessage(jsondata.msg);
					$('.tipsy').remove();
				}
				
				
			}
		});
			
		},
		moveEvent : function(event, dayDelta, minuteDelta, allDay, revertFunc) {
			if ($('#event').length != 0) {
				revertFunc();
				return;
			}
			//CalendarPlus.UI.loading(true);
			
			$.ajax({
			type : 'POST',
			url : OC.generateUrl('apps/'+CalendarPlus.appname+'/moveevent'),
			data :{
				id : event.id,
				dayDelta : dayDelta,
				minuteDelta : minuteDelta,
				allDay : allDay ? 1 : 0,
				lastmodified : event.lastmodified
			},
			success : function(jsondata) {
				
				if(jsondata.status == 'success'){
				//	CalendarPlus.UI.loading(false);
					$('.tipsy').remove();
					event.lastmodified = jsondata.lastmodified;
					CalendarPlus.UI.timerLock = true;
					CalendarPlus.Util.loadDayList(true);
				}else{
				//	CalendarPlus.UI.loading(false);
					CalendarPlus.Util.showGlobalMessage(jsondata.msg);
					$('.tipsy').remove();
					revertFunc();
					$('#fullcalendar').fullCalendar('updateEvent', event);
				}
			},
			error : function(jsondata) {
				
				CalendarPlus.UI.loading(false);
				$('.tipsy').remove();
				revertFunc();
				$('#fullcalendar').fullCalendar('updateEvent', event);
			}
		});
			
		},
		
		resizeEvent : function(event, dayDelta, minuteDelta, revertFunc) {
			$('.tipsy').remove();
		//	CalendarPlus.UI.loading(true);
			
			$.ajax({
			type : 'POST',
			url : OC.generateUrl('apps/'+CalendarPlus.appname+'/resizeevent'),
			data :{
				id : event.id,
				dayDelta : dayDelta,
				minuteDelta : minuteDelta,
				lastmodified : event.lastmodified
			},
			success : function(jsondata) {
				if(jsondata.status == 'success'){
				//	CalendarPlus.UI.loading(false);
					$('.tipsy').remove();
					event.lastmodified = jsondata.lastmodified;
					CalendarPlus.UI.timerLock = true;
					CalendarPlus.Util.loadDayList(true);
				}else{
				//	CalendarPlus.UI.loading(false);
					CalendarPlus.Util.showGlobalMessage(jsondata.msg);
					$('.tipsy').remove();
					revertFunc();
					$('#fullcalendar').fullCalendar('updateEvent', event);
				}
				
			},
			error : function(jsondata) {
				CalendarPlus.UI.loading(false);
				$('.tipsy').remove();
				revertFunc();
				$('#fullcalendar').fullCalendar('updateEvent', event);
			}
			});
			
			
		},
		showadvancedoptions : function() {
			$("#advanced_options").slideDown('slow');
			$("#advanced_options_button").css("display", "none");
		},

		setDateTimeLabelonEvent:function(sStart,sEnd){
			//allday_checkbox
			if(sStart == sEnd){
				if ($('#allday_checkbox').is(':checked')) {
					$('#ldatetime').text(t(CalendarPlus.appname,'On')+' '+sStart);
				}else{
					$('#ldatetime').text(t(CalendarPlus.appname,'On')+' '+sStart+' '+$('#fromtime').val()+' '+t(CalendarPlus.appname,'To')+' '+$('#totime').val());
				}
			}else{
				if ($('#allday_checkbox').is(':checked')) {
					$('#ldatetime').text(t(CalendarPlus.appname,'From')+' '+sStart+' '+t(CalendarPlus.appname,'To')+' '+sEnd);
				}else{
					$('#ldatetime').text(t(CalendarPlus.appname,'From')+' '+sStart+' '+$('#fromtime').val()+' '+t(CalendarPlus.appname,'To')+' '+sEnd+' '+$('#totime').val());
				}
			}
		},
		lockTime : function() {
			if ($('#allday_checkbox').is(':checked')) {
				$("#fromtime").attr('disabled', true).addClass('disabled');
				$("#totime").attr('disabled', true).addClass('disabled');
				$('#lendtime').hide();
				$('#lstarttime').hide();
			} else {
				$("#fromtime").attr('disabled', false).removeClass('disabled');
				$("#totime").attr('disabled', false).removeClass('disabled');
				$('#lendtime').show();
				$('#lstarttime').show();

			}
		},
		showCalDAVUrl : function(username, calname) {
			$('#caldav_url').val(OC.linkToRemote(CalendarPlus.appname)+'/calendars/' + username + '/' + calname);
			$('#caldav_url').show();
			$("#caldav_url_close").show();
		},
		reminder : function(task) {
			if (task == 'init') {
				$('#remCancel').on('click', function() {
					$('#showOwnReminderDev').hide();
					if ($('#submitNewEvent').length !== 0) {
						CalendarPlus.UI.reminder('reminderreset');

					}
					return false;
				});
				$('#remOk').on('click', function() {
					CalendarPlus.Util.getReminderonSubmit();
					$('#showOwnReminderDev').hide();
					return false;
				});

				$('#showOwnReminderDev').hide();

				//$('.advancedReminder').css('display', 'none');

				CalendarPlus.UI.reminder('reminder');
				CalendarPlus.UI.reminder('remindertime');
			}
			if (task === 'reminderreset') {
				var sReminderSel = '#sReminderSelect.combobox';
				$(sReminderSel + ' li .colCal').removeClass('isSelectedCheckbox');
				$(sReminderSel + ' li').removeClass('isSelected');
				$('#reminder').val('none');
				$('#reminderTrOutput').hide();
				$("#reminderoutput").text('');
				$("#sReminderRequest").val('');
				$(sReminderSel + ' li[data-id=none]').addClass('isSelected');
				$(sReminderSel + ' li[data-id=none]').parents(sReminderSel).find('.selector').html($(sReminderSel + ' li[data-id=none]').text());
				$(sReminderSel + ' li[data-id=none]').find('.colCal').addClass('isSelectedCheckbox');
			}

			if (task === 'reminder') {
				$('.advancedReminder').css('display', 'none');

				if ($('#reminderAdvanced option:selected').val() === 'DISPLAY') {

					$('#reminderemailinputTable').css('display', 'none');
					$('#reminderTable').css('display', 'block');
					$('#remindertimeinput').css('display', 'block');
				}
				if ($('#reminderAdvanced option:selected').val() === 'EMAIL') {
					$('#reminderemailinputTable').css('display', 'block');
					$('#reminderTable').css('display', 'block');
					$('#remindertimeinput').css('display', 'block');
				}
			}
			if (task === 'remindertime') {

				$('#reminderemailinputTable').css('display', 'none');
				$('#reminderdateTable').css('display', 'none');
				$('#remindertimeinput').css('display', 'block');
				if ($('#remindertimeselect option:selected').val() === 'ondate') {
					$('#reminderdateTable').css('display', 'block');
					$('#remindertimeinput').css('display', 'none');
				}
			}
		},

		repeat : function(task) {
			if (task == 'init') {

				$('#rCancel').on('click', function() {
					$('#showOwnDev').hide();
					if ($('#submitNewEvent').length != 0) {
						// $('#repeat option[value=doesnotrepeat]').attr('selected','selected');
						var sRepeaterSel = '#sRepeatSelect.combobox';
						$(sRepeaterSel + ' li .colCal').removeClass('isSelectedCheckbox');
						$(sRepeaterSel + ' li').removeClass('isSelected');
						$('#repeat').val('doesnotrepeat');
						$('#rEndRepeat').hide();
						$('#rEndRepeatOutput').hide();
						$("#rruleoutput").text('');
						$(sRepeaterSel + ' li[data-id=doesnotrepeat]').addClass('isSelected');
						$(sRepeaterSel + ' li[data-id=doesnotrepeat]').parents(sRepeaterSel).find('.selector').html($(sRepeaterSel + ' li[data-id=doesnotrepeat]').text());
						$(sRepeaterSel + ' li[data-id=doesnotrepeat]').find('.colCal').addClass('isSelectedCheckbox');
					}
					return false;
				});
				$('#rOk').on('click', function() {
					CalendarPlus.Util.getrRuleonSubmit();
					$('#showOwnDev').hide();
					return false;
				});

				$('div#showOwnDev input[type=radio]').change(function(event) {

					if ($(this).val() == 'every') {
						$('#rByweekday').addClass('ui-isDisabled');
						$('#rBymonthday').removeClass('ui-isDisabled');
					}
					if ($(this).val() == 'onweekday') {
						$('#rByweekday').removeClass('ui-isDisabled');
						$('#rBymonthday').addClass('ui-isDisabled');
					}
				});

				$('div#showOwnDev input[name=checkMonth]').click(function(event) {
					$('#rByweekdayYear').toggleClass('ui-isDisabled');
				});

				$('#showOwnDev').hide();

				CalendarPlus.Util.Selectable('#rByweekday li');
				CalendarPlus.Util.Selectable('#rBymonthday li');
				CalendarPlus.Util.Selectable('#rBymonth li');
				CalendarPlus.Util.Selectable('#rByweekdayYear li');
				CalendarPlus.Util.Selectable('#rByweekdayWeek li');

				$('input[name="bydate"]').datepicker({
					minDate : null,
					dateFormat : 'dd-mm-yy'
				});

				CalendarPlus.UI.repeat('end');
				CalendarPlus.UI.repeat('repeat');
			}
			if (task == 'end') {
				$('#byoccurrences').css('display', 'none');
				$('#bydate').css('display', 'none');
				if ($('#end option:selected').val() == 'count') {
					$('#byoccurrences').css('display', 'block');
				}
				if ($('#end option:selected').val() == 'date') {
					$('#bydate').css('display', 'block');
				}
			}
			if (task == 'repeat') {
				$('.advancedRepeat').css('display', 'none');

				if ($('#rAdvanced option:selected').val() == 'DAILY') {
					$('#sInterval').text(t(CalendarPlus.appname, 'All'));
					$('#sInterval1').text(t(CalendarPlus.appname, 'Days'));
				}

				if ($('#rAdvanced option:selected').val() == 'MONTHLY') {
					$('#sInterval').text(t(CalendarPlus.appname, 'All'));
					$('#sInterval1').text(t(CalendarPlus.appname, 'Months'));

					$('#checkBoxVisible').hide();
					$('#radioVisible').show();

					$('#advanced_weekday').css('display', 'block');
					$('#advanced_weekofmonth').css('display', 'block');
					$('#advanced_bymonthday').css('display', 'block');

				}
				if ($('#rAdvanced option:selected').val() == 'WEEKLY') {
					$('#sInterval').text(t(CalendarPlus.appname, 'All'));
					$('#sInterval1').text(t(CalendarPlus.appname, 'Weeks') + ' ' + t(CalendarPlus.appname, 'on') + ':');
					$('#advanced_weekdayWeek').css('display', 'block');
				}
				if ($('#rAdvanced option:selected').val() == 'YEARLY') {
					$('#sInterval').text(t(CalendarPlus.appname, 'All'));
					$('#checkBoxVisible').show();
					$('#radioVisible').hide();
					$('#sInterval1').text(t(CalendarPlus.appname, 'Years') + ' im:');
					$('#advanced_bymonth').css('display', 'block');
					$('#advanced_weekdayYear').css('display', 'block');
					$('#advanced_weekofmonth').css('display', 'block');

				}

			}

		},
		
		categoriesChanged : function(newcategories) {
			
			if(newcategories.length !== CalendarPlus.calendarConfig['categories'].length){
				var newCat = [];
				var newTags={};
				$.each(newcategories, function(i, el) {
					
					if(CalendarPlus.calendarConfig['tags'][el.name]!== undefined){
						newCat[i] = el.name;
						newTags[el.name]=CalendarPlus.calendarConfig['tags'][el.name];
					}else{
						newCat[i] = el.name;
						newTags[el.name]={'name':el.name,'bgcolor':'#006DCC','color':'#ffffff'};
					}
				});
				
				CalendarPlus.calendarConfig['categories'] = newCat;
				CalendarPlus.calendarConfig['tags'] = newTags;
				
				//$('#tagmanager').tagit('destroy');
				CalendarPlus.UI.buildCategoryList();
			}
			
		},
		buildCategoryList : function() {
			var htmlCat = '';
			$.each(CalendarPlus.calendarConfig['tags'], function(i, elem) {
				
				htmlCat += '<li class="categorieslisting" title="' + elem['name'] + '"><span class="catColPrev" style="background-color:'+elem['bgcolor']+';color:'+elem['color']+';">' + elem['name'].substring(0, 1) + '</span> ' + elem['name'] + '</li>';
			});

			$('#categoryCalendarList').html(htmlCat);
			$('.categorieslisting').each(function(i, el) {
				$(el).on('click', function() {
					CalendarPlus.UI.filterCategory($(this).attr('title'));
				});
			});

			$(".categorieslisting").draggable({
				appendTo : "body",
				helper : "clone",
				cursor : "move",
				delay : 500,
				start : function(event, ui) {
					ui.helper.addClass('draggingContact');
				}
			});

		},
		filterCategory : function(catname) {
			$('#fullcalendar .fc-event .categories').find('a.catColPrev').each(function(i, el) {

				if ($(el).attr('title') == catname) {
					$Event = $(el).closest('.fc-event');
					$Event.fadeOut(600).fadeIn(600).fadeOut(400).fadeIn(400);
					/*
					 $Event.animate({marginTop: "-0.6in"},
					 {
					 duration: 1000,
					 complete: function() {
					 $( this ).animate({marginTop: "0in",});
					 }
					 });
					 */
				}
			});
		},
		Events : {
			renderEvents : function(event, element) {
				//share-alt,repeat,lock,clock-o,eye
				var EventInner = element.find('.fc-event-inner').attr({'data-id': event.id});
					element.droppable({
						activeClass : "activeHover",
						hoverClass : "dropHover",
						accept : '.categorieslisting',
						over : function(event, ui) {
	
						},
						drop : function(event, ui) {
							CalendarPlus.UI.addCategory($(this).find('.fc-event-inner').data('id'), ui.draggable.attr('title'));
						}
				});
				if (event.orgevent) {
					element.css('border', '2px dotted #000000');
				}
				if (event.bday) {
					
					EventInner.prepend(CalendarPlus.Util.addIconsCal('Happy Birthday', 'birthday', '14'));
					
				}
				if (event.isalarm) {
					EventInner.prepend(CalendarPlus.Util.addIconsCal(t(CalendarPlus.appname, 'Reminder'), 'clock', '14'));
				}

				if (event.isrepeating) {
					EventInner.prepend(CalendarPlus.Util.addIconsCal(t(CalendarPlus.appname, 'Repeat'), 'repeat', '14'));
				}

				if (event.shared) {
					
					EventInner.prepend(CalendarPlus.Util.addIconsCal(t('core', 'Shared'), 'share', '14'));
				}
				if (event.privat == 'private') {
					EventInner.prepend(CalendarPlus.Util.addIconsCal(t(CalendarPlus.appname, 'Show As'), 'lock', '12'));
				}
				if (event.privat == 'confidential') {
					EventInner.prepend(CalendarPlus.Util.addIconsCal(t(CalendarPlus.appname, 'Show As'), 'eye', '12'));
				}

				if (event.categories.length > 0) {
					var $categories = $('<div style="float:right;margin-top:2px;">').addClass('categories').prependTo(EventInner);
					$(event.categories).each(function(i, category) {
						if(CalendarPlus.calendarConfig['tags'][category]){
							$categories.append($('<a>').addClass('catColPrev').css({'background-color':CalendarPlus.calendarConfig['tags'][category]['bgcolor'],'color':CalendarPlus.calendarConfig['tags'][category]['color']}).text(category.substring(0, 1)).attr('title', category));
						}
					});
				}
			}
		},
		Calendar : {
			activation : function(checkbox, calendarid) {
				CalendarPlus.UI.loading(true);
				$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/setactivecalendar'), {
					calendarid : calendarid,
					active : checkbox.checked ? 1 : 0
				}, function(data) {
					CalendarPlus.UI.loading(false);
					if (data.status == 'success') {

						checkbox.checked = data.active == 1;

						if (data.active == 1) {
							$('#fullcalendar').fullCalendar('addEventSource', data.eventSource);
						} else {

							$('#fullcalendar').fullCalendar('removeEventSource', data.eventSource.url);
						}
						CalendarPlus.Util.loadDayList(true);
						
						CalendarPlus.Util.rebuildTaskView();
						//CalendarPlus.Util.rebuildCalView();
					}

				});
			},
			refreshCalendar : function(calendarid) {
				CalendarPlus.UI.loading(true);
				$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/refreshsubscribedcalendar'), {
					calendarid : calendarid
				}, function(jsondata) {
					if (jsondata.status == 'success') {
						CalendarPlus.UI.loading(false);
						$('#fullcalendar').fullCalendar('refetchEvents');
					}
				});

			},
			choosenCalendar : function(calendarid) {
				$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/setmyactivecalendar'), {
					calendarid : calendarid
				}, function(jsondata) {
					if (jsondata.status == 'success') {
						$('.calListen[data-id=' + jsondata.choosencalendar + ']').addClass('isActiveCal');
						$('.calListen[data-id=' + jsondata.choosencalendar + '] .colCal').addClass('isActiveUserCal');
						CalendarPlus.calendarConfig['choosenCalendar'] = jsondata.choosencalendar;
					}
				});

			},
			newCalendar : function(object) {
				var tr = $('<tr />').attr('class','treditcal').load(OC.generateUrl('apps/'+CalendarPlus.appname+'/getnewformcalendar'), function(data) {
					$('input.minicolor').miniColors({
						letterCase : 'uppercase',
					});
					$('#editCalendar-submit').on('click', function () {
							CalendarPlus.UI.Calendar.submit($(this), $(this).data('id'));
						});
						
					$('#editCalendar-cancel').on('click', function () {
								CalendarPlus.UI.Calendar.cancel($(this), $(this).data('id'));
						});
				});
				
				$(object).closest('tr').after(tr).hide();
			},
			edit : function(object, calendarid) {
				var tr = $(document.createElement('tr')).load(OC.generateUrl('apps/'+CalendarPlus.appname+'/geteditformcalendar'), {
					calendarid : calendarid
				}, function() {
					//CalendarPlus.UI.Calendar.colorPicker(this)
					$('input.minicolor').miniColors({
						letterCase : 'uppercase',
					});
					$('#editCalendar-submit').on('click', function () {
							CalendarPlus.UI.Calendar.submit($(this), $(this).data('id'));
						});
						
					$('#editCalendar-cancel').on('click', function () {
						CalendarPlus.UI.Calendar.cancel($(this), $(this).data('id'));
					});
				});
				$(object).closest('tr').after(tr).hide();
			},
			deleteCalendar : function(calid) {
				
				var check = confirm(t(CalendarPlus.appname,'Do you really want to delete this calendar?'));

				if (check == false) {
					return false;
				} else {
					$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/deletecalendar'), {
						calendarid : calid
					}, function(data) {
						if (data.status == 'success') {
							
							var url =OC.generateUrl('apps/'+CalendarPlus.appname+'/getevents')+'?calendar_id='+calid;
							$('#fullcalendar').fullCalendar('removeEventSource', url);
							$('#calendarList tr[data-id="' + calid + '"]').fadeOut(400, function() {
								$('#calendarList tr[data-id="' + calid + '"]').remove();
							});
							$('#fullcalendar').fullCalendar('refetchEvents');
							CalendarPlus.Util.rebuildCalView();
						}
					});
				}
			},
			submit : function(button, calendarid) {
				var displayname = $.trim($("#displayname_" + calendarid).val());
				var active = 0;
				if ($("#edit_active_" + calendarid).is(':checked')) {
					active = 1;
				}
				var description = $("#description_" + calendarid).val();

				var calendarcolor = $("#calendarcolor_" + calendarid).val();
				if (displayname === '') {
					$("#displayname_" + calendarid).css('background-color', '#FF2626');
					$("#displayname_" + calendarid).focus(function() {
						$("#displayname_" + calendarid).css('background-color', '#F8F8F8');
					});
				}

				var url;
				if (calendarid == 'new') {
					var externuri = $("#externuri_" + calendarid).val();
					if (externuri !== '') {
						//Lang
						$("#externuri_" + calendarid).after('<div id="messageTxtImportCal">Importiere ... Bitte warten!</div>');
					}
					url = OC.generateUrl('apps/'+CalendarPlus.appname+'/newcalendar');
				} else {
					url = OC.generateUrl('apps/'+CalendarPlus.appname+'/editcalendar');
				}

				$.post(url, {
					id : calendarid,
					name : displayname,
					active : active,
					description : description,
					color : calendarcolor,
					externuri : externuri
				}, function(data) {
					if (data.status == 'error') {
						$("#messageTxtImportCal").css('color', 'red').text(data.message);
						$("#externuri_" + calendarid).css('background-color', '#FF2626');
						$("#externuri_" + calendarid).focus(function() {
							$("#externuri_" + calendarid).css('background-color', '#F8F8F8');
						});
						
						$("#messageTxtImportCal").animate({
							color : 'green',
						}, 3000, function() {
							$(this).remove();
							prevElem.html(data.page).show().next().remove();
						});
					}
					if (data.status == 'success') {
						
						var prevElem = $(button).closest('tr').prev();

						if (data.countEvents !== false) {
							//Lang
							$("#messageTxtImportCal").text('Importierte Events: ' + data.countEvents);
							$("#messageTxtImportCal").animate({
								color : 'green',
							}, 3000, function() {
								$(this).remove();
								prevElem.html(data.page).show().next().remove();
							});
						} else {
							
							prevElem.html(data.page).show().next().remove();
						}

						$('#fullcalendar').fullCalendar('removeEventSource', data.eventSource.url);
						$('#fullcalendar').fullCalendar('addEventSource', data.eventSource);
						CalendarPlus.calendarConfig['calendarcolors'][data.calid] = {};
						CalendarPlus.calendarConfig['calendarcolors'][data.calid]['bgcolor'] = data.eventSource.backgroundColor;
						CalendarPlus.calendarConfig['calendarcolors'][data.calid]['color'] = data.eventSource.textColor;
						
						if (calendarid == 'new') {
							$(prevElem).attr('data-id', data.calid);
							
							$('table#calendarList').append('<tr><td colspan="6"><a href="#" id="newCalendar"><input type="button" value="' + t(CalendarPlus.appname,'New Calendar') + '"></a></td></tr>');
							
						}
						CalendarPlus.Util.rebuildCalView();
					} else {
						//error
						$("#displayname_" + calendarid).css('background-color', '#FF2626');
						$("#displayname_" + calendarid).focus(function() {
							$("#displayname_" + calendarid).css('background-color', '#F8F8F8');
						});
					}
				}, 'json');
			},
			cancel : function(button, calendarid) {
				$(button).closest('tr').prev().show().next().remove();
			}
		},

		Drop : {
			init : function() {
				if ( typeof window.FileReader === 'undefined') {
					console.log('The drop-import feature is not supported in your browser :(');

					return false;
				}

				droparea = document.getElementById('fullcalendar');
				droparea.ondragover = function() {
					return false;
				};
				droparea.ondragend = function() {
					return false;
				};
				droparea.ondrop = function(e) {
					e.preventDefault();
					e.stopPropagation();
					CalendarPlus.UI.Drop.drop(e);
				};
			

			},
			drop : function(e) {
				if (e.dataTransfer != undefined) {
					var files = e.dataTransfer.files;

					for (var i = 0; i < files.length; i++) {

						var file = files[i];
						// alert(file.type);
						if (!file.type.match('text/calendar'))
							continue;

						var reader = new FileReader();
						reader.onload = function(event) {
							CalendarPlus.Import.Store.isDragged = true;
							CalendarPlus.Import.Dialog.open(event.target.result);

							//Calendar_Import.Dialog.open(event.target.result);
							//$('#fullcalendar').fullCalendar('refetchEvents');
						};
						reader.readAsDataURL(file);
					}
				}
			},
			doImport : function(data) {

				$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/importeventsperdropcalendar'), {
					'data' : data
				}, function(result) {
					if (result.status == 'success') {
						$('#fullcalendar').fullCalendar('addEventSource', result.eventSource);
						$('#notification').html(result.message);
						$('#notification').slideDown();
						window.setTimeout(function() {
							$('#notification').slideUp();
						}, 5000);
						return true;
					} else {
						$('#notification').html(result.message);
						$('#notification').slideDown();
						window.setTimeout(function() {
							$('#notification').slideUp();
						}, 5000);
					}
				});
			}
		}
	},
	Settings : {
		//
	},

};

$.fullCalendar.views.list = ListView;
function ListView(element, calendar) {
	var $this = this;

	// imports
	jQuery.fullCalendar.views.month.call($this, element, calendar);
	//jQuery.fullCalendar.BasicView.call(t, element, calendar, 'month');
	var opt = $this.opt;
	var trigger = $this.trigger;
	var eventElementHandlers = $this.eventElementHandlers;
	var reportEventElement = $this.reportEventElement;
	var formatDate = calendar.formatDate;
	var formatDates = calendar.formatDates;
	var addDays = $.fullCalendar.addDays;
	var cloneDate = $.fullCalendar.cloneDate;
	//var clearTime =  $.fullCalendar.clearTime;
	var skipHiddenDays = $this.skipHiddenDays;

	function clearTime(d) {
		d.setHours(0);
		d.setMinutes(0);
		d.setSeconds(0);
		d.setMilliseconds(0);
		return d;
	}

	function skipWeekend(date, inc, excl) {
		inc = inc || 1;
		while (!date.getDay() || (excl && date.getDay() == 1 || !excl && date.getDay() == 6)) {
			addDays(date, inc);
		}
		return date;
	}

	// overrides
	$this.name = 'list';
	$this.render = render;
	$this.renderEvents = renderEvents;
	$this.setHeight = setHeight;
	$this.setWidth = setWidth;
	$this.clearEvents = clearEvents;

	function setHeight(height, dateChanged) {
	}

	function setWidth(width) {
	}

	function clearEvents() {
		//this.reportEventClear();
	}

	// main
	function sortEvent(a, b) {
		return a.start - b.start;
	}

	function render(date, delta) {
		var viewDays = 14;
		if (delta) {
			addDays(date, delta * viewDays);
		}

		var start = addDays(cloneDate(date), -((date.getDay() - opt('firstDay') + viewDays) % viewDays));
		var end = addDays(cloneDate(start), viewDays);

		var visStart = cloneDate(start);
		skipHiddenDays(visStart);

		var visEnd = cloneDate(end);
		skipHiddenDays(visEnd, -1, true);

		$this.title = formatDates(visStart, addDays(cloneDate(visEnd), -1), opt('titleFormat', 'week'));
		$this.start = start;
		$this.end = end;
		$this.visStart = visStart;
		$this.visEnd = visEnd;

	}

	function eventsOfThisDay(events, theDate) {
		var start = cloneDate(theDate, true);
		var end = addDays(cloneDate(start), 1);
		var retArr = new Array();

		$.each(events, function(i, value) {
			var event_end = $this.eventEnd(events[i]);
			if (events[i].start < end && event_end >= start) {
				retArr.push(events[i]);
			}
		});
		return retArr;
	}

	function renderEvent(event) {
		if (event.allDay) {//all day event
			var time = opt('allDayText');
		} else {

			var time = formatDates(event.start, event.end, opt('timeFormat', 'agenda'));
		}
		var classes = ['fc-event', 'fc-list-event'];
		classes = classes.concat(event.className);

		if (event.source) {
			classes = classes.concat(event.source.className || []);
		}

		var bgColor = '#D4D5AA';
		var color = '#000000';
		if ( typeof CalendarPlus.calendarConfig['calendarcolors'][event.calendarid] != 'undefined') {
			bgColor = CalendarPlus.calendarConfig['calendarcolors'][event.calendarid]['bgcolor'];
			color = CalendarPlus.calendarConfig['calendarcolors'][event.calendarid]['color'];
		}
		var imgBday = '';
		if (event.bday) {
			imgBday=CalendarPlus.Util.addIconsCal('Happy Birthday', 'birthday', '14');

		}
		var imgReminder = '';
		if (event.isalarm) {
		   imgReminder=CalendarPlus.Util.addIconsCal(t(CalendarPlus.appname, 'Reminder'), 'clock', '14');
		}

		var imgShare = '';
		if (event.shared) {
			 imgShare=CalendarPlus.Util.addIconsCal(t('core', 'Shared'), 'share', '14');
		}

		var imgPrivate = '';

		if (event.privat == 'private') {
			imgPrivate=CalendarPlus.Util.addIconsCal(t(CalendarPlus.appname, 'Show As'), 'lock', '14');
		}
		if (event.privat == 'confidential') {
			imgPrivate=CalendarPlus.Util.addIconsCal(t(CalendarPlus.appname, 'Show As'), 'eye', '14');
		}
		eventLocation = '';
		if (event.location != '' && event.location != null && typeof event.location != 'undefined') {

			eventLocation = '<span class="location">' + event.location + '</span>';
		}
		var imgRepeating = '';
		if (event.isrepeating) {
		    imgRepeating=CalendarPlus.Util.addIconsCal(t(CalendarPlus.appname, 'Repeat'), 'repeat', '14');
		}

		var Kategorien = '';
		if (event.categories.length > 0) {

			Kategorien = '<div style="float:right;margin-top:2px;" class="categories">';

			$(event.categories).each(function(i, category) {
				if(CalendarPlus.calendarConfig['tags'][category]){
					
				Kategorien += '<a class="catColPrev" style="background-color:'+CalendarPlus.calendarConfig['tags'][category]['bgcolor']+';color:'+CalendarPlus.calendarConfig['tags'][category]['color']+';" title="'+category+'">' + category.substring(0, 1) + '</a>';
				}
			});
			Kategorien += '</div>';
		}
		var html = '<tr class="fc-list-row">' + '<td>&nbsp;</td>' + '<td class="fc-list-time ">' + time + '</td>' + '<td>&nbsp;</td>' + '<td class="fc-list-event">' + '<span id="list' + event.id + '"' + ' class="' + classes.join(' ') + '"' + '>' + '<span class="colorCal-list" style="margin-top:6px;background-color:' + bgColor + ';">' + '&nbsp;' + '</span>' + '<span class="list-icon">' + imgBday + imgShare + ' ' + imgPrivate + ' ' + imgRepeating + ' ' + imgReminder + '&nbsp;' + '</span>' + '<span class="fc-event-title" data-id="'+ event.id+'">' + escapeHTML(event.title) + '</span>' + '<span>' + Kategorien + '</span>' + '<span>' + eventLocation + '</span>' + '</span>' + '</td>' + '</tr>';

		return html;
	}

	function renderDay(date, events) {

		var today = clearTime(new Date());

		var addTodayClass = '';
		if (+date == +today) {
			addTodayClass = 'fc-list-today';

		}

		var dayRows = $('<tr>' + '<td colspan="4" class="fc-list-date ' + addTodayClass + '">' + '&nbsp;<span>' + formatDate(date, opt('titleFormat', 'day')) + '</span>' + '</td>' + '</tr>');

		$.each(events, function(i, value) {

			var event = events[i];
			var eventElement = $(renderEvent(event));
			triggerRes = trigger('eventRender', event, event, eventElement);
			if (triggerRes === false) {
				eventElement.remove();
			} else {
				if (triggerRes && triggerRes !== true) {
					eventElement.remove();
					eventElement = $(triggerRes);
				}
				$.merge(dayRows, eventElement);
				eventElementHandlers(event, eventElement);
				reportEventElement(event, eventElement);
			}
		});
		return dayRows;
	}

	function renderEvents(events, modifiedEventId) {
		events = events.sort(sortEvent);

		var table = $('<table class="fc-list-table" align="center"></table>');
		var total = events.length;
		if (total > 0) {
			var date = cloneDate($this.visStart);
			while (date <= $this.visEnd) {
				var dayEvents = eventsOfThisDay(events, date);
				if (dayEvents.length > 0) {
					table.append(renderDay(date, dayEvents));
				}
				date = addDays(date, 1);
			}
		} else {
			table = $('<div>').text('No Events');

		}

		this.element.html(table);
	}

}

function formatDatePretty(date, formatOpt) {
	if ( typeof date == 'number') {
		date = new Date(date);
	}
	return $.datepicker.formatDate(formatOpt, date);
}

/*
 var openEvent = function(id) {
 if(typeof Calendar !== 'undefined') {
 CalendarPlus.openEvent(id);
 } else {
 window.location.href = OC.linkTo('calendar', 'index.php') + '#' + id;
 }
 };
 */

var resizeTimeout = null;
$(window).resize(_.debounce(function() {
	if (resizeTimeout)
		clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(function() {
		CalendarPlus.Util.rebuildCalendarDim();

	}, 500);
}));

$(document).ready(function() {
	
	$('.view button.viewaction').hide();
	
	$(document).on('click', '#dropdown #dropClose', function(event) {
		event.preventDefault();
		event.stopPropagation();
		OC.Share.hideDropDown();
		return false;
	});
		
	$(document).on('click', 'a.share', function(event) {
	//	if (!OC.Share.droppedDown) {
		event.preventDefault();
		event.stopPropagation();
		var itemType = $(this).data('item-type');
		var AddDescr =t(CalendarPlus.appname,'Calendar')+' ';
		var sService ='';
		if(itemType === CalendarPlus.calendarConfig['sharetypecalendar']){
			AddDescr=t(CalendarPlus.appname,'Calendar')+' ';
			sService = CalendarPlus.calendarConfig['sharetypecalendar'];
		}
		if(itemType === CalendarPlus.calendarConfig['sharetypeevent']){
			AddDescr=t(CalendarPlus.appname,'Event')+' ';
			sService = CalendarPlus.calendarConfig['sharetypeevent'];
			$('#event #haveshareaction').val('1');
		}
		
		var itemSource = $(this).data('title');
			  itemSource = '<div>'+AddDescr+itemSource+'</div><div id="dropClose"><i class="ioc ioc-close" style="font-size:22px;"></i></div>';
			  
		if (!$(this).hasClass('shareIsOpen') && $('a.share.shareIsOpen').length === 0) {
			$('#infoShare').remove();
			$( '<div id="infoShare">'+itemSource+'</div>').prependTo('#dropdown');
				
		}else{
			$('a.share').removeClass('shareIsOpen');
			$(this).addClass('shareIsOpen');
			//OC.Share.hideDropDown();
		}
		//if (!OC.Share.droppedDown) {
			$('#dropdown').css('opacity',0);
			$('#dropdown').animate({
				'opacity': 1,
			},500);
		//}
    
		(function() {
			
			var targetShow = OC.Share.showDropDown;
			
			OC.Share.showDropDown = function() {
				var r = targetShow.apply(this, arguments);
				$('#infoShare').remove();
				$( '<div id="infoShare">'+itemSource+'</div>').prependTo('#dropdown');
				
				return r;
			};
			if($('#linkText').length > 0){
				$('#linkText').val($('#linkText').val().replace('public.php?service='+sService+'&t=','index.php/apps/'+CalendarPlus.appname+'/s/'));
	
				var target = OC.Share.showLink;
				OC.Share.showLink = function() {
					var r = target.apply(this, arguments);
					
					$('#linkText').val($('#linkText').val().replace('public.php?service='+sService+'&t=','index.php/apps/'+CalendarPlus.appname+'/s/'));
					
					return r;
				};
			}
		})();
		if (!$('#linkCheckbox').is(':checked')) {
				$('#linkText').hide();
		}
		return false;
		//}
	});
	

	
	CalendarPlus.init();
	//CalendarPlus.UI.initScroll();
	

	/***NEW ***/

	$('.inputTasksRow').each(function(i, el) {
		$(el).click(CalendarPlus.Util.completedTaskHandler);
	});

	/**END**/

	$(OC.Tags).on('change', function(event, data) {

		if (data.type === 'event') {
			CalendarPlus.UI.categoriesChanged(data.tags);
		}
	});


	

	$('.view button').each(function(i, el) {
		$(el).on('click', function() {
			$('#fullcalendar').show();
			if ($(this).data('view') === false) {
				$('#fullcalendar').fullCalendar($(this).data('action'));
			} else {

				$('#fullcalendar').fullCalendar('option', 'weekends', $(this).data('weekends'));
				$('#fullcalendar').fullCalendar('changeView', $(this).data('action'));

			}
		});
	});

	$('#datecontrol_today').click(function() {
		$('#fullcalendar').fullCalendar('today');
	});
	$('#printCal').click(function() {
		//yearColumns:2,
		
		 $('#fullcalendar').printElement({ 
		 	printMode: 'popup' ,
		 	pageTitle:'wussa',
		 	overrideElementCSS: ['http://127.0.0.1/81rc1/apps/'+CalendarPlus.appname+'/css/3rdparty/fullcalendar.print.css']
		 	});
	});
	
	//CalendarPlus.UI.Share.init();
	CalendarPlus.UI.Drop.init();

	$('#choosecalendarGeneralsettings').on('click keydown', function(event) {
		event.preventDefault();
		var popup = $('#appsettings_popup');
		if(popup.length === 0) {
			$('body').prepend('<div class="popup hidden" id="appsettings_popup"></div>');
			popup = $('#appsettings_popup');
			popup.addClass($('#appsettings').hasClass('topright') ? 'topright' : 'bottomleft');
		}
		if(popup.is(':visible')) {
			if(OC.Share.droppedDown){
				OC.Share.hideDropDown();
			}
			popup.hide().remove();
		} else {
			var arrowclass = $('#appsettings').hasClass('topright') ? 'up' : 'left';
			var url = OC.generateUrl('apps/'+CalendarPlus.appname+'/calendarsettingsindex');
			$.ajax({
				type : 'GET',
				url : url,
				success : function(data) {
					popup.html(data);
					
					popup.prepend('<span class="arrow '+arrowclass+'"></span><h2>'+t('core', 'Settings')+'</h2><a class="close svg"></a>').show();
					popup.find('.close').bind('click', function() {
						if(OC.Share.droppedDown){
							OC.Share.hideDropDown();
						}
						popup.remove();
					});
					$.getScript(OC.filePath(CalendarPlus.appname, 'js', 'settings.js'))
						.fail(function(jqxhr, settings, e) {
							throw e;
						});
					
					
					popup.show();
					
					
				}
			});
		}
		
	});

	//CalendarPlus.Util.rebuildCalendarDim();

	$('#tasknavActive').on('click', function(event) {

		event.stopPropagation();
		var checkedTask = 'false';
		if ($(this).hasClass('button-info')) {
			$(this).removeClass('button-info');
			$('#rightCalendarNav').addClass('isHiddenTask');
			$('#rightCalendarNav').html('');
			CalendarPlus.Util.rebuildCalendarDim();
			checkedTask = 'false';
		} else {
			$(this).addClass('button-info');
			$('#rightCalendarNav').removeClass('isHiddenTask');
			CalendarPlus.Util.rebuildTaskView();
			checkedTask = 'true';
		}
		$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/calendarsettingssettasknavactive'), {
			checked : checkedTask
		});

	});

	$('#calendarnavActive').on('click', function(event) {

		event.stopPropagation();
		var checkedCal = false;
		if ($(this).hasClass('button-info')) {
			$(this).removeClass('button-info');
			$('#app-navigation').addClass('isHiddenCal');
			$('#leftcontent').html('');
			CalendarPlus.Util.rebuildCalendarDim();
			checkedCal = false;
		} else {
			$(this).addClass('button-info');
			$('#app-navigation').removeClass('isHiddenCal');
			
			checkedCal = true;
		}
		$.post(OC.generateUrl('apps/'+CalendarPlus.appname+'/calendarsettingssetcalendarnavactive'), {
			checked : checkedCal
		},function(data){
			if(checkedCal ===true){
				CalendarPlus.Util.rebuildCalView();
			}
		});

	});

	
	$('#editCategoriesList').on('click', function() {
		$(this).tipsy('hide');
		OC.Tags.edit('event');
	});
  
	$('#categoryCalendarList').hide();
	$('#showCategory').click(function() {
			if (! $('#categoryCalendarList').is(':visible')) {
			$('h3[data-id="lCategory"] i.ioc-angle-down').removeClass('ioc-rotate-270');
			$('#categoryCalendarList').show('fast');
		} else {
			$('#categoryCalendarList').hide('fast');
			$('h3[data-id="lCategory"] i.ioc-angle-down').addClass('ioc-rotate-270');
		}
	});

});

$(window).bind('hashchange', function() {
	CalendarPlus.Util.checkShowEventHash();
});


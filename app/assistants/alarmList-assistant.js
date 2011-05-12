function AlarmListAssistant(alarm) {
	if(alarm !== undefined) {
		this.newAlarm = alarm;
	}
}

AlarmListAssistant.prototype.setup = function() {
	// set up alarm services
	Alarm.setupEvents = (function(alarm) {
		Mojo.Log.error("Setting up events for "+alarm.title+" at "+Alarm.formatNextTime(alarm));
		this.controller.serviceRequest("palm://com.palm.power/timeout", {
			method: "set",
			parameters: {
				"wakeup" : true,
				"key" : "com.rboyce.bipbipbip."+alarm.id,
				"uri": "palm://com.palm.applicationManager/open",
				"at" : Alarm.formatNextTime(alarm),
				"params" : "{'id':'com.rboyce.bipbipbip','params': {'alarm': '"+alarm.id+"'}}"
			}
		});
		// add events for each chained alarm
		if(alarm.alarmChain && alarm.alarmChain.length) {
			alarm.alarmChain.forEach(function(chain) {
				// TODO: re-add follow-up alarms
				// Alarm.setupEvents(chain);
			});
		}
	}).bind(this);
	Alarm.removeEvents = (function(alarm) {
		Mojo.Log.error("Removing events for "+alarm.title);
		this.controller.serviceRequest("palm://com.palm.power/timeout", {
			method: "clear",
			parameters: {
				"key" : "com.rboyce.bipbipbip."+alarm.id
			}
		}); 
		// remove events for each chained alarm
		if(alarm.alarmChain) {
			alarm.alarmChain.forEach(function(chain) {
				// TODO: re-add follow-up alarms
				// Alarm.removeEvents(chain);
			});
		}
	}).bind(this);
	
	if(Bip.alarms === undefined) {
		Bip.alarms = [];
		Bip.loadAlarms((function() {
			this.controller.get("spinner-container").hide();
			this.alarmListModel.items = Bip.alarms;
			this.controller.modelChanged(this.alarmListModel, this);
		}).bind(this));
	}
	else if(this.newAlarm !== undefined) {
		this.controller.get("spinner-container").show();
		Bip.alarms.push(alarm);
		Bip.saveAlarms((function() {
			this.controller.get("spinner-container").hide();
		}).bind(this));
	}
	else {
		Bip.saveAlarms((function() {
			this.controller.get("spinner-container").hide();
			this.alarmListModel.items = Bip.alarms;
			this.controller.modelChanged(this.alarmListModel, this);
		}).bind(this));
	}
	
	if(Bip.alarmSource) {
		this.controller.get("header-details").innerHTML = "<strong>Launched by:</strong> "+Bip.alarmSource;
	}
	else {
		var showNextTime = (function() {
			if(Bip.nextAlarmTime) {
				this.controller.get("header-details").innerHTML = "<strong>Next:</strong> "+Bip.nextAlarmTitle+" in "+Alarm.printRelativeTime(Bip.nextAlarmTime);
			}
			else {
				this.controller.get("header-details").innerHTML = "<strong>Next:</strong> There are no alarms set to go off.";
			}
		}).bind(this);
		showNextTime();
		setInterval(showNextTime, 1000);
	}
	
	this.controller.setupWidget("big-spinner", 
		{
			spinnerSize: Mojo.Widget.spinnerLarge
		}, 
		{}
	);
	this.controller.setupWidget("alarmList",
		this.alarmListAttributes = {
			itemTemplate: "alarmList/alarmListItem",
			listTemplate: "alarmList/alarmListContainer",
			swipeToDelete: true,
			reorderable: true,
			formatters: {
				setDaysOfWeek: function(propertyValue, model) {
					if(model.repeat !== undefined) {
						if(!model.repeatEnabled) {
							model.daysOfWeekFormatted = "Once";
						}
						else {
							var days = [];
							model.repeat.forEach(function(day, i) {
								if(day) {
									days.push(Alarm.daysOfWeek[i]);
								}
							});
							
							if(days.length === 7) {
								model.daysOfWeekFormatted = "Daily";
							}
							else if(days.length === 0) {
								model.daysOfWeekFormatted = "Once";
							}
							else if(days.length === 5 && !model.repeat[0] && !model.repeat[6]) {
								model.daysOfWeekFormatted = "Weekdays";
							}
							else if(days.length > 3) {
								model.daysOfWeekFormatted = "";
								model.repeat.forEach(function(day, i) {
									model.daysOfWeekFormatted += (day ? Alarm.daysOfWeek[i].charAt(0) : "–")+" ";
								});
							}
							else {
								model.daysOfWeekFormatted = days.join(' ');
							}
						}
					}
				},
				setTime: function(propertyValue, model) {
					if(model.time !== undefined && model.time.getHours !== undefined) {
						var aOrP = '';
						var hour = model.time.getHours();
						var minute = model.time.getMinutes();
						
						if(Mojo.Format.using12HrTime()) {
							if(hour < 12 || hour === 24) {
								aOrP = "am";
							}
							else {
								aOrP = "pm";
							}
							hour = hour % 12;
							if(hour === 0) {
								hour += 12;
							}
						}
						if(minute < 10) {
							minute = '0'+minute;
						}
						
						model.timeFormatted = hour+':'+minute+' '+aOrP;
					}
				},
				setTitle: function(propertyValue, model) {
					if(!model.title) {
						model.titleFormatted = "Alarm";
					}
					else {
						model.titleFormatted = model.title;
					}
				}
			}
		},
		this.alarmListModel = {
			listTitle: $L("Alarms"),
			items : Bip.alarms
		}
	);
	this.controller.setupWidget(
		'alarm-checkbox',
		{modelProperty: 'enabled'}
	);
	Mojo.Event.listen(
		this.controller.get("alarmList"), 
		Mojo.Event.propertyChange,
		function(event) {
			Bip.saveAlarms();
		}
	); 
	Mojo.Event.listen(
		this.controller.get("alarmList"), 
		Mojo.Event.listTap, 
		function(event) {
			if(event.originalEvent.down.clientX < 240) {
				Mojo.Controller.stageController.pushScene("alarmDetails", event.item);
			}
		}
	); 
	Mojo.Event.listen(
		this.controller.get("alarmList"), 
		Mojo.Event.listDelete, 
		function(event) {
			Bip.alarms.splice(event.index, 1);
			Bip.saveAlarms();
		}
	); 
	Mojo.Event.listen(
		this.controller.get("alarmList"), 
		Mojo.Event.listReorder, 
		function(event) {
			Bip.alarms.splice(event.fromIndex, 1);
			Bip.alarms.splice(event.toIndex, 0, event.item);
			Bip.saveAlarms();
		}
	); 
	
	// set up Add Alarm button
	this.controller.setupWidget(
		"addAlarm",
		{},
		{
			label : "Add Alarm",
			disabled: false
		}
	);
	Mojo.Event.listen(
		this.controller.get("addAlarm"), 
		Mojo.Event.tap, 
		function() {
			Mojo.Controller.stageController.pushScene("alarmDetails");
		}
	); 
};

AlarmListAssistant.prototype.ready = function(){
	this.controller.get("big-spinner").mojo.start();
};

AlarmListAssistant.prototype.activate = function(event) {
	this.alarmListModel.items = Bip.alarms;
	this.controller.modelChanged(this.alarmListModel, this);
};

AlarmListAssistant.prototype.deactivate = function(event) {
};

AlarmListAssistant.prototype.cleanup = function(event) {
};

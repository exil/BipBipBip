function AlarmListAssistant(alarm) {
	if(alarm !== undefined) {
		Bip.alarms.push(alarm);
		Bip.saveAlarms();
	}
}

AlarmListAssistant.prototype.setup = function() {
	Bip.saveAlarms();
	this.controller.setupWidget("alarmList",
		this.alarmListAttributes = {
			itemTemplate: "alarmList/listitem",
			listTemplate: "alarmList/listcontainer",
			swipeToDelete: true,
			reorderable: true,
			emptyTemplate:"alarmList/emptylist",
			formatters: {
				setDaysOfWeek: function(propertyValue, model) {
					if(model.repeat !== undefined) {
						if(model.repeat.length === 7) {
							model.daysOfWeekFormatted = "Daily";
						}
						else if(model.repeat.length === 0) {
							model.daysOfWeekFormatted = "Once";
						}
						else if(model.repeat.length === 5) {
							model.daysOfWeekFormatted = "Weekdays";
							var i;
							for(i = 0; i < model.repeat.length; i++) {
								if(model.repeat[i] === "sat" || model.repeat[i] === "sun") {
									model.daysOfWeekFormatted = model.repeat.join(' ');
									break;
								}
							}
							model.repeat.forEach(function() {
								
							});
						}
						else {
							model.daysOfWeekFormatted = model.repeat.join(' ');
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
			Bip.saveAlarms();
			Mojo.Controller.stageController.pushScene("alarmDetails", event.item);
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
			Bip.saveAlarms();
			Mojo.Controller.stageController.pushScene("alarmDetails");
		}
	); 
};

AlarmListAssistant.prototype.activate = function(event) {
	this.alarmListModel.items = [];
	this.controller.modelUpdated(this.alarmListModel, this);
	this.alarmListModel.items = Bip.alarms;
	this.controller.modelUpdated(this.alarmListModel, this);
};

AlarmListAssistant.prototype.deactivate = function(event) {
};

AlarmListAssistant.prototype.cleanup = function(event) {
};

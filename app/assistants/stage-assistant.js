Bip = {
	saveAlarms: function(callback) {
		Bip.nextAlarmTime = false;
		Bip.nextAlarmTitle = false;
	
		// set up DB if not already
		if(!Bip.DB) {
			Bip.loadAlarms(function() {
				Bip.saveAlarms(callback);
			});
		}
		else {
			Bip.alarms.forEach(function(alarm) {
				Alarm.removeEvents(alarm);
				if(alarm.enabled) {
					Alarm.setupEvents(alarm);
				}
				
				var nextTime = Alarm.getNextTime(alarm);
				if(alarm.enabled && (!Bip.nextAlarmTime || nextTime < Bip.nextAlarmTime)) {
					Bip.nextAlarmTime = nextTime;
					Bip.nextAlarmTitle = alarm.title;
				}
				
				// Mojo.Log.error("alarm: %j", alarm);
				
				// Reformat time to string for database 
				if(typeof alarm !== "string") {
					alarm.time = alarm.time.toUTCString();
				}
			});
			Mojo.Log.error("Saving to DB");
			Bip.DB.add(
				"alarmList", 
				{alarms: Bip.alarms}, 
				callback
			);
			Bip.alarms.forEach(function(alarm) {
				// Reformat string to time
				alarm.time = new Date(alarm.time);
			});
		}
	},
	loadAlarms: function(callback) {
		// set up DB if not already
		if(!Bip.DB) {
			Bip.DB = new Mojo.Depot(
				{
					name:"alarms"
				}, 
				function() {
					Bip.loadAlarms(callback);
				}
			);
		}
		else {
			Bip.DB.get(
				"alarmList", 
				function(result) {
					Mojo.Log.error("Loaded from DB");
					if(result && result.alarms) {
						Bip.alarms = result.alarms;
					}
					Bip.alarms.forEach(function(alarm) {
						alarm.time = new Date(alarm.time);
					});
					if(typeof callback === "function") {
						callback();
					}
				}
			);
		}
	},
	resetAlarms: function(callback) {
		Mojo.Log.error("Resetting DB");
		if(Bip.DB) {
			Bip.DB.remove(
				null,
				"alarmList", 
				callback
			);
		}
	}
};

// workaround for missing Date.toGMTString
Date.prototype.toGMTString = function() {
	return this.toUTCString();
};

Array.prototype.removeAll = function(remove) {
	var result = [];
	this.forEach(function(item) {
		if(item !== remove) {
			result.push(item);
		}
	});
	return result;
};

function StageAssistant() {}

StageAssistant.prototype.setup = function() {
	this.controller.pushScene("first");	
};

function AppAssistant() {}

AppAssistant.prototype.handleLaunch = function(params) {  
	 if(params && params.alarm) {
		Bip.alarmSource = params.alarm;
		Mojo.Log.error("Launched by alarm "+Bip.alarmSource);
	 }
};
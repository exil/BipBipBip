Bip = {
	alarms: [],
	saveAlarms: function() {
		Bip.alarms.forEach(function(alarm) {
			alarm.time = alarm.time.toUTCString();
		});
	
		Mojo.Log.error("Saving cookie: "+JSON.stringify(Bip.alarms));
		
		// TODO: Use HTML5/Mojo.Depot instead of cookies...
		var cookie = new Mojo.Model.Cookie("alarms");
		cookie.put(Bip.alarms);
		
		Bip.alarms.forEach(function(alarm) {
			alarm.time = new Date(alarm.time);
		});
	},
	loadAlarms: function() {
		// TODO: Use HTML5/Mojo.Depot instead of cookies...
		var cookie = new Mojo.Model.Cookie("alarms");
		var alarms = cookie.get();
		if(alarms) {
			Mojo.Log.error("Loading cookie: %j", alarms);
			Bip.alarms = alarms;
		
			Bip.alarms.forEach(function(alarm) {
				alarm.time = new Date(alarm.time);
			});
		}
	},
	resetAlarms: function() {
		var cookie = new Mojo.Model.Cookie("alarms");
		cookie.remove();
	}
};

// workaround for missing Date.toGMTString
Date.prototype.toGMTString = function() {
	return this.toUTCString();
};

function StageAssistant() {}

StageAssistant.prototype.setup = function() {
	/*
	var alarm = new Alarm(new Date("October 13, 1975 11:00:00"));
	alarm.title = "Test Alarm 1";
	alarm.repeat = ["mon", "wed", "fri"];
	Bip.alarms.push(alarm);
	alarm = new Alarm(new Date());
	alarm.title = "Test Alarm 2";
	alarm.repeat = [];
	Bip.alarms.push(alarm);
	alarm = new Alarm(new Date());
	alarm.title = "Test Alarm 3";
	alarm.repeat = ["mon", "tue", "wed", "thu", "fri"];
	Bip.alarms.push(alarm);
	alarm = new Alarm(new Date());
	alarm.title = "Test Alarm 4";
	alarm.repeat = ["sun", "tue", "wed", "thu", "fri"];
	Bip.alarms.push(alarm);
	*/
	// Bip.resetAlarms();
	Bip.loadAlarms();

	this.controller.pushScene("alarmList");
};

function AppAssistant() {}

AppAssistant.prototype.handleLaunch = function(params) {   
	 if(params && params.alarm) {
		Bip.alarmSource = params.alarm;
	 }
};
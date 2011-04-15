Bip = {
	alarms: [],
	saveAlarms: function(callback) {
		// set up DB if not already
		if(!Bip.DB) {
			Bip.DB = new Mojo.Depot(
				{
					name:"alarms"
				}, 
				function() {
					Bip.saveAlarms(callback);
				}
			);
		}
		else {
			Bip.alarms.forEach(function(alarm) {
				alarm.time = alarm.time.toUTCString();
			});
			Mojo.Log.error("Saving to DB: %j", {alarms: Bip.alarms});
			Bip.DB.add(
				"alarmList", 
				{alarms: Bip.alarms}, 
				callback
			);
			Bip.alarms.forEach(function(alarm) {
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
					Mojo.Log.error("Loaded from DB: %j", result);
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

function StageAssistant() {}

StageAssistant.prototype.setup = function() {
	/*
		boyce's code
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
	
	Bip.loadAlarms((function() {
		this.controller.pushScene("alarmList");
	}).bind(this));
	
};

function AppAssistant() {}

AppAssistant.prototype.handleLaunch = function(params) {   
	 if(params && params.alarm) {
		Bip.alarmSource = params.alarm;
	 }
};
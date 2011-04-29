function FirstAssistant() {
}

FirstAssistant.prototype.setup = function() {
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
				Alarm.setupEvents(chain);
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
				Alarm.removeEvents(chain);
			});
		}
	}).bind(this);
	
	if(Bip.alarms === undefined) {
		Bip.alarms = [];
		Bip.loadAlarms((function() {
			Mojo.Controller.stageController.swapScene("alarmList");
		}).bind(this));
	}
	else {
		Bip.saveAlarms((function() {
			Mojo.Controller.stageController.swapScene("alarmList");
		}).bind(this));
	}
	
	this.controller.setupWidget("big-spinner", 
		{
			spinnerSize: Mojo.Widget.spinnerLarge
		}, 
		{}
	);
};

FirstAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

FirstAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

FirstAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};

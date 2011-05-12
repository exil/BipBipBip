function FirstAssistant() {
}

FirstAssistant.prototype.setup = function() {
	var alarmsLoaded = function() {
		Mojo.Controller.stageController.swapScene("alarmList");
	};
	
	if(Bip.alarms === undefined) {
		Bip.alarms = [];
		Bip.loadAlarms(alarmsLoaded);
	}
	else {
		alarmsLoaded();
	}
	
	this.controller.setupWidget("big-spinner", 
		{
			spinnerSize: Mojo.Widget.spinnerLarge
		}, 
		{}
	);
};

FirstAssistant.prototype.activate = function(event) {
};

FirstAssistant.prototype.deactivate = function(event) {
};

FirstAssistant.prototype.cleanup = function(event) {
};

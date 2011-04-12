function AlarmDetailsAssistant(alarm) {
	this.isNewAlarm = (alarm === undefined);
	if(this.isNewAlarm) {
		this.alarm = new Alarm();
	}
	else {
		this.alarm = alarm;
	}
}

AlarmDetailsAssistant.prototype.setup = function() {
	// set up header
	if(!this.isNewAlarm) {
		this.controller.get("headerTitle").innerHTML = "Edit Alarm";
		if(this.alarm.title) {
			this.controller.get("headerTitle").innerHTML = "Edit "+this.alarm.title;
		}
	}

	/*
	this.controller.setupWidget(
		"enabled", 
		{
		}, 
		{
			value: this.alarm.enabled,
			disabled: false
		}
	);
	Mojo.Event.listen(
		this.controller.get("enabled"), 
		Mojo.Event.propertyChange, 
		(function(event) {
			if(event.value) {
				this.alarm.enable();
			}
			else {
				this.alarm.disable();
			}
		}).bind(this)
	);
	*/

	this.controller.setupWidget(
		"title", 
		{
			multiline: false,
			enterSubmits: false,
			autoFocus: this.isNewAlarm,
			changeOnKeyPress: true,
			hintText: "Alarm"
		}, 
		{
			value: this.alarm.title,
			disabled: false
		}
	);
	Mojo.Event.listen(
		this.controller.get("title"), 
		Mojo.Event.propertyChange, 
		(function(event) {
			this.alarm.title = event.value;
			
			if(!this.isNewAlarm) {
				this.controller.get("headerTitle").innerHTML = "Edit Alarm";
				if(this.alarm.title) {
					this.controller.get("headerTitle").innerHTML = "Edit "+this.alarm.title;
				}
			}
		}).bind(this)
	);
	
	this.controller.setupWidget(
		"time",
		{
			modelProperty: 'time',
			labelPlacement: Mojo.Widget.labelPlacementRight
		},
		{
			time: new Date(this.alarm.time)
		}
	);
	Mojo.Event.listen(
		this.controller.get("time"), 
		Mojo.Event.propertyChange, 
		(function(event) {
			this.alarm.time = event.value.toUTCString();;
		}).bind(this)
	);
	
	var repeats = (this.alarm.repeat.length > 0);
	if(repeats) {
		var repeatSelector = this.controller.get("repeatSelector");
		Mojo.Animation.animateStyle(
			repeatSelector, 
			"height",
			"linear",
			{from: 0, to: 80, duration: 0}
		);
	}
	this.controller.setupWidget(
		"repeatCheck", 
		{},
		this.repeatCheckModel = {
			value: repeats,
			disabled: false
		}
	);
	Mojo.Event.listen(
		this.controller.get("repeatCheck"), 
		Mojo.Event.propertyChange, 
		(function(event) {
			this.alarm.repeat = [];
			if(event.value) {
				this.showRepeatSelector();
			}
			else {
				this.hideRepeatSelector();
			}
		}).bind(this)
	);
	// TODO: set up weekly repeater widget
	
	this.controller.setupWidget("snoozeDuration",
		{
			choices: [
				{label: "No snooze", value: 0},
				{label: "5 minutes", value: 5},
				{label: "10 minutes", value: 10},
				{label: "20 minutes", value: 20}
			],
			labelPlacement: Mojo.Widget.labelPlacementRight,
			label: "Snooze",
			multiline: true
		}, {
			value: this.alarm.snoozeDuration,
			disabled: false
		}
	);
	Mojo.Event.listen(
		this.controller.get("snoozeDuration"), 
		Mojo.Event.propertyChange, 
		(function(event) {
			this.alarm.snoozeDuration = event.value;
		}).bind(this)
	);
	
	this.controller.setupWidget("soundSelector",
	{
		choices: [
			{label: "Vibrate only", value: 0},
			{label: "Birds Chirping", value: 1},
			{label: "Buzzer", value: 2}
		],
		labelPlacement: Mojo.Widget.labelPlacementRight,
		label: "Sound",
		multiline: true
	}, {
		value: 0,
		disabled: false
	}
	);
	
	var saveButtonLabel = "Save Alarm";
	if(this.isNewAlarm) {
		saveButtonLabel = "Create Alarm";
	}
	this.controller.setupWidget(
		"saveAlarm",
		{},
		{
			label : saveButtonLabel,
			buttonClass: "affirmative",
			disabled: false
		}
	);
	Mojo.Event.listen(
		this.controller.get("saveAlarm"), 
		Mojo.Event.tap, 
		(function() {
			if(this.isNewAlarm) {
				Bip.alarms.push(this.alarm);
			}
			Bip.saveAlarms(function() {
				// hackish, but alarmList wont be redrawn if we just pop...
				Mojo.Controller.stageController.popScenesTo({transition: Mojo.Transition.none});
				Mojo.Controller.stageController.pushScene("alarmList");
			});
		}).bind(this)
	); 
};

AlarmDetailsAssistant.prototype.activate = function(event) {
};

AlarmDetailsAssistant.prototype.deactivate = function(event) {
};

AlarmDetailsAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};

AlarmDetailsAssistant.prototype.showRepeatSelector = function() {
	var repeatSelector = this.controller.get("repeatSelector");
	Mojo.Animation.animateStyle(
		repeatSelector, 
		"height",
		"linear",
		{from: 0, to: 80, duration: .5}
	);
};
AlarmDetailsAssistant.prototype.hideRepeatSelector = function() {
	var repeatSelector = this.controller.get("repeatSelector");
	Mojo.Animation.animateStyle(
		repeatSelector, 
		"height",
		"linear",
		{from: 80, to: 0, duration: .5}
	);
};
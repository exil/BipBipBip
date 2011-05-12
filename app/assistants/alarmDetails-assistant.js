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
				this.alarm.enabled = true;
			}
			else {
				this.alarm.enabled = false;
			}
		}).bind(this)
	);

	this.controller.setupWidget(
		"title", 
		{
			multiline: false,
			enterSubmits: false,
			autoFocus: this.isNewAlarm,
			changeOnKeyPress: true,
			hintText: "Alarm",
			textCase: Mojo.Widget.steModeTitleCase
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
			time: this.alarm.time
		}
	);
	Mojo.Event.listen(
		this.controller.get("time"), 
		Mojo.Event.propertyChange, 
		(function(event) {
			this.alarm.time = event.value;
		}).bind(this)
	);
	
	if(this.alarm.repeatEnabled) {
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
			value: this.alarm.repeatEnabled,
			disabled: false
		}
	);
	Mojo.Event.listen(
		this.controller.get("repeatCheck"), 
		Mojo.Event.propertyChange, 
		(function(event) {
			if(event.value) {
				this.alarm.repeatEnabled = true;
				this.showRepeatSelector();
			}
			else {
				this.alarm.repeatEnabled = false;
				this.hideRepeatSelector();
			}
		}).bind(this)
	);
	Mojo.Event.listen(
		this.controller.get("repeatCheckLabel"), 
		Mojo.Event.tap, 
		(function(event) {
			this.repeatCheckModel.value = !(this.repeatCheckModel.value);
			this.controller.modelChanged(this.repeatCheckModel, this.controller.get("repeatCheckLabel"));
			this.alarm.repeat = [false, false, false, false, false, false, false];
			if(this.repeatCheckModel.value) {
				this.showRepeatSelector();
			}
			else {
				this.hideRepeatSelector();
			}
		}).bind(this)
	);
	
	// set up weekly repeater widget
	Mojo.Event.listen(
		this.controller.get("repeatSelector"), 
		Mojo.Event.tap, 
		(function(event) {
			var target = $(event.target);
			if(target.hasClassName("radiobutton")) {
				target.toggleClassName("selected");
				var targetDay = target.innerHTML.toLowerCase();
				var targetIndex = -1;
				Alarm.daysOfWeek.forEach(function(day, i) {
					if(day === targetDay) {
						targetIndex = i;
					}
				});
				if(targetIndex >= 0) {
					this.alarm.repeat[targetIndex] = target.hasClassName("selected");
				}
				// Mojo.Log.error("%j", {index: i, day: target.innerHTML});
			}
		}).bind(this)
	);
	$$("#repeatSelector .radiobutton").each((function(target) {
		var targetDay = target.innerHTML.toLowerCase();
		var targetIndex = -1;
		Alarm.daysOfWeek.forEach(function(day, i) {
			if(day === targetDay) {
				targetIndex = i;
			}
		});
		if(targetIndex >= 0 && this.alarm.repeat[targetIndex]) {
			$(target).addClassName("selected");
		}
	}).bind(this));
	
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
	Mojo.Event.listen(
		this.controller.get("minigames-row"), 
		Mojo.Event.tap, 
		(function(event) {
			Mojo.Controller.stageController.pushScene("setupQuestions", this.alarm);
		}).bind(this)
	);
	
	this.controller.setupWidget("chainList",
		this.chainListAttributes = {
			itemTemplate: "alarmDetails/chainListItem",
			listTemplate: "alarmDetails/chainListContainer",
			swipeToDelete: true,
			reorderable: false,
			formatters: {
				setRelativeTimeDisplay: function(propertyValue, model) {
					if(model.offset !== undefined) {
						model.absoluteOffset = Math.abs(model.offset);
						model.isBefore = (model.offset < 0);
						// Mojo.Log.error("ChainAlarm: %j", model);
					}
				}
			}
		},
		this.chainListModel = {
			listTitle: $L("Chain Alarms"),
			items : this.alarm.alarmChain
		}
	);
	Mojo.Event.listen(
		this.controller.get("chainList"), 
		Mojo.Event.listDelete, 
		(function(event) {
			this.alarm.alarmChain.splice(event.index, 1);
		}).bind(this)
	); 
	Mojo.Event.listen(
		this.controller.get("chainList"), 
		Mojo.Event.listReorder, 
		(function(event) {
			this.alarm.alarmChain.splice(event.fromIndex, 1);
			this.alarm.alarmChain.splice(event.toIndex, 0, event.item);
		}).bind(this)
	);
	this.controller.setupWidget(
		"chainBefore", 
		{
			trueLabel: "before",
			falseLabel: "after",
			modelProperty: "isBefore"
		}, 
		{}
	);
	this.controller.setupWidget(
		"chainOffset",
		{
			choices: [
				{label: "5 minutes", value: 5},
				{label: "10 minutes", value: 10},
				{label: "20 minutes", value: 20},
				{label: "1 hour", value: 60},
				{label: "2 hours", value: 120},
				{label: "8 hours", value: 480}
		   ],
			multiline: true,
			modelProperty: "absoluteOffset"
		}, 
		{}
	);
	this.controller.setupWidget(
		"chainGames",
		{modelProperty: 'playGames'}
	);
	Mojo.Event.listen(
		this.controller.get("chainList"), 
		Mojo.Event.propertyChange,
		(function(event) {
			this.alarm.alarmChain.forEach(function(chain) {
				if(chain.absoluteOffset !== undefined && chain.isBefore !== undefined) {
					chain.offset = (chain.isBefore ? (-1*chain.absoluteOffset) : chain.absoluteOffset);
				}
			});
		}).bind(this)
	); 
	
	Mojo.Event.listen(
		this.controller.get("addChain"), 
		Mojo.Event.tap, 
		(function() {
			this.alarm.alarmChain.push(new ChainAlarm(this.alarm, 10));
			this.controller.modelChanged(this.chainListModel, this);
		}).bind(this)
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
	this.controller.get("minigames-details").innerHTML = this.alarm.gameCount + " " + this.alarm.gameType + (this.alarm.gameCount === 1 ? "" : "s");
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
		{from: 0, to: 70, duration: 0.4}
	);
};
AlarmDetailsAssistant.prototype.hideRepeatSelector = function() {
	var repeatSelector = this.controller.get("repeatSelector");
	Mojo.Animation.animateStyle(
		repeatSelector, 
		"height",
		"linear",
		{from: 70, to: 0, duration: 0.4}
	);
};
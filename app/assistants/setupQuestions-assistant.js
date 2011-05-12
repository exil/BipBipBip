function SetupQuestionsAssistant(alarm) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	   
		Mojo.Log.error("poo: %j", alarm);
		
	   // set object alarm
	   this.alarm = alarm;
	   this.alarm.gameType = "question";
}

SetupQuestionsAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	// arithmetic questions
			
	// this.intModel = {intValue: 5};
	this.intModel = {intValue: this.alarm.gameCount}; // why da fuck doesn't this work
	this.controller.setupWidget('arithmeticPicker',
		this.attributes = {
			label: 'Arithmetic',
			modelProperty: 'intValue', 
			// modelProperty: 'gameCount', // why da fuck doesn't this work
			min: 0,
			max: 10
		},
		this.intModel
		// this.alarm.gameCount // why da fuck doesn't this work
	);
	
	this.controller.listen('arithmeticPicker', Mojo.Event.propertyChange, (function(event) {
		this.alarm.gameCount = this.intModel.intValue;
	}).bind(this));

	// save button
	this.controller.setupWidget("saveButton",
		{},
		{
			label : "Save Questions",
			buttonClass: "affirmative",
			disabled: false
		}
	);
	Mojo.Event.listen(
		this.controller.get("saveButton"), 
		Mojo.Event.tap, 
		function() {
			Bip.saveAlarms(function() {
				Mojo.Controller.stageController.popScene(); // go to the appropriate scene
			});
			
		}
	); 
};

SetupQuestionsAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SetupQuestionsAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SetupQuestionsAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};

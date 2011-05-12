function QuestionAssistant(alarm) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	   
	   this.alarm = alarm;
}

QuestionAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	
	// TO-DO: fix up style. damn ugly
	
	
		// answer #1
		this.controller.setupWidget("answer1",
			{},
			{
				label : "16",
				disabled: false,
				buttonClass: "secondary"
			}
		);
		Mojo.Event.listen(
			this.controller.get("answer1"), 
			Mojo.Event.tap, 
			function() {
				// need code to handle scoring
				Bip.saveAlarms();
				Mojo.Controller.stageController.pushScene("question"); // go to the appropriate scene
			}
		); 

		// answer #2
		this.controller.setupWidget("answer2",
			{},
			{
				label : "eleventy billion",
				disabled: false,
				buttonClass: "secondary"
			}
		);
		Mojo.Event.listen(
			this.controller.get("answer2"), 
			Mojo.Event.tap, 
			function() {
				// need code to handle scoring
				Bip.saveAlarms();
				Mojo.Controller.stageController.pushScene("question"); // go to the appropriate scene
			}
		); 

		// answer #3
		this.controller.setupWidget("answer3",
			{},
			{
				label : "texa$",
				disabled: false,
				buttonClass: "secondary"
			}
		);
		Mojo.Event.listen(
			this.controller.get("answer3"), 
			Mojo.Event.tap, 
			function() {
				// need code to handle scoring
				Bip.saveAlarms();
				Mojo.Controller.stageController.pushScene("question"); // go to the appropriate scene
			}
		); 

		// answer #4
		this.controller.setupWidget("answer4",
			{},
			{
				label : "2",
				disabled: false,
				buttonClass: "secondary"
			}
		);
		Mojo.Event.listen(
			this.controller.get("answer4"), 
			Mojo.Event.tap, 
			function() {
				// need code to handle scoring
				Bip.saveAlarms();
				Mojo.Controller.stageController.pushScene("question"); // go to the appropriate scene
			}
		); 		

		// answer #5
		this.controller.setupWidget("answer5",
			{},
			{
				label : "fiftylol",
				disabled: false,
				buttonClass: "secondary"
			}
		);
		Mojo.Event.listen(
			this.controller.get("answer5"), 
			Mojo.Event.tap, 
			function() {
				// need code to handle scoring
				Bip.saveAlarms();
				Mojo.Controller.stageController.pushScene("question"); // go to the appropriate scene
			}
		);
		
	// progress bar
	// http://www.weboshelp.net/webos-mojo-development-resources/ui-widget-list/323-progressbar
/*
		this.controller.setupWidget("questionProgressBar",
			this.attributes = {
				title: "Progress Bar",
				image: "images/header-icon.png",
				modelProperty: "progress"
			},
			this.model = {
				iconPath: "../images/progress-bar-background.png",
				progress: 0
			}
		);
*/

	// progress pill
		this.controller.setupWidget("questionProgressPill",
			this.attributes = {
				title: "0/0 Correct Answers",
//				image: "images/header-icon.png",
				modelProperty: "progress"
			},
			this.model = {
				iconPath: "../images/progress-bar-background.png",
				progress: 0
			}
		);

/*
	this.lgProgressBarModel = {
			progress: 0;
		}
		this.controller.setupWidget('questionProgressBar',this.lgProgressBarModel);
		
		// updates progress bar
		if (this.progressCounter > 1) {
			this.completeProgress();
		}
		else {
			this.lgProgressBarModel.progress = this.lgProgressBarModel.progress + 0.2;
			this.controller.modelChanged(this.lgProgressBarModel);
		}
*/
		
	/* add event handlers to listen to events from widgets */
	
};

QuestionAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

QuestionAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

QuestionAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	   
	   // to-do: clean up handlers
	   
};

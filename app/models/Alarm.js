/**
 * Creates a basic Alarm object
 * 
 * @constructor
 * @this {Alarm}
 * @param {number} hour The hour (0-23) of the alarm
 * @param {number} minute The minute (0-59) of the alarm
 */
function Alarm(time) {
	if(time === undefined) {
		time = new Date();
	}
	
	// generate unique id
	this.id = (new Date()).getTime();

	this.time = time;
	
	this.title = undefined;
	
	this.enabled = true;
	
	// repeat on days of the week ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
	this.repeatEnabled = false;
	this.repeat = [false, false, false, false, false, false, false];
	
	// length of reprieve granted by snooze button in minutes
	this.snoozeDuration = 10;
	
	this.sound = null;
	
	// The list of AlarmGame ids to choose from for this alarm
	this.activeGames = [];
	// the number of games to be completed as part of the alarm
	this.gameCount = 0;
	
	this.alarmChain = [];
}
Alarm.daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
/**
 * TODO: Sets up the Alarm as a background event
 * 
 * @this {Alarm}
 */
Alarm.setupEvents = function(alarm) {
	// add events for each chained alarm
	if(alarm.alarmChain) {
		alarm.alarmChain.forEach(function(chain) {
			Alarm.setupEvents(chain);
		});
	}
	// TODO:
};
Alarm.prototype.setupEvents = function(alarm) {
	Alarm.setupEvents(this);
};
/**
 * TODO: Removes background events associated with this Alarm
 * 
 * @this {Alarm}
 */
Alarm.removeEvents = function(alarm) {
	// remove events for each chained alarm
	if(alarm.alarmChain) {
		alarm.alarmChain.forEach(function(chain) {
			Alarm.removeEvents(chain);
		});
	}
	// TODO:
};
Alarm.prototype.removeEvents = function() {
	Alarm.removeEvents(this);
};
/**
 * TODO: Called when the alarm goes off
 * 
 * @this {Alarm}
 */
Alarm.trigger = function(alarm) {
	// TODO:
};
Alarm.prototype.trigger = function() {
	Alarm.trigger(this);
};
/**
 * Format the date in the way required by webOS
 * 
 * @this {Alarm}
 */
Alarm.getNextTime = function(alarm) {
	var nextTime;
	if(alarm.time) {
		nextTime = new Date();
		nextTime.setHours(alarm.time.getHours());
		nextTime.setMinutes(alarm.time.getMinutes());
		if(nextTime < (new Date())) {
			nextTime = new Date(nextTime.getTime() + 24*60*60*1000);
			nextTime.setHours(alarm.time.getHours());	 // this is to avoid DST bugs..
		}
	}
	if(alarm.repeatEnabled) {
		var i;
		for(i = 0; i < 7; i++) {
			var checkDay = new Date(nextTime.getTime() + i*24*60*60*1000);
			checkDay.setHours(alarm.time.getHours());	 // this is to avoid DST bugs..
			if(alarm.repeat[checkDay.getDay()]) {
				return checkDay;
			}
		}
	}
	if(alarm.offset) {
		return (new Date(Alarm.getNextTime(alarm.parent).getTime() + (offset * 60000)));
	}
	return nextTime;
};
Alarm.prototype.getNextTime = function() {
	Alarm.getnextTime(this);
};
Alarm.formatNextTime = function(alarm) {
	var nextTime = Alarm.getNextTime(alarm);
	
	if(nextTime) {
		var mm = ("0"+(nextTime.getUTCMonth()+1)).slice(-2);
		var dd = ("0"+nextTime.getUTCDate()).slice(-2);
		var yyyy = nextTime.getUTCFullYear();
		var hh = ("0"+nextTime.getUTCHours()).slice(-2);
		var nn = ("0"+nextTime.getUTCMinutes()).slice(-2);
		
		return mm+"/"+dd+"/"+yyyy+" "+hh+":"+nn+":00";
	}
	else {
		return false;
	}
};
Alarm.prototype.formatNextTime = function() {
	Alarm.formatNextTime(this);
};

/**
 * Creates a relative ChainAlarm object
 * 
 * @constructor
 * @this {ChainAlarm}
 * @param {offset} offset The time offset in minutes from the base alarm
 */
function ChainAlarm(parent, offset) {
	// generate unique id
	this.id = new Date().getTime();
	
	this.parent = parent;
	
	this.offset = offset;
	
	this.allowSnooze = true;
	
	this.sound = null;
	
	this.games = [];
}
ChainAlarm.prototype = new Alarm();


/**
 * Represents an alarm tone to be played
 * Might need to be kept in an external file
 * 
 * @constructor
 * @this {AlarmSound}
 * @param {string} name The display name of the alarm tone
 * @param {string} path The path to the audio file to be played
 */
function AlarmSound(name, path) {
	this.name = name;
	this.path = path;
	this.duration = duration;
}

/**
 * Represents a minigame be played
 * Might need to be kept in an external file
 * 
 * @constructor
 * @this {AlarmGame}
 * @param {string} name The display name of the minigame
 * @param {function} play A callback to launch the game. Takes successCallback and failureCallback as arguments
 */
function AlarmGame(name, play) {
	this.name = name;
	this.play = play;
}
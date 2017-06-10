var SlackNode = require('slack-node');
var exec = require('child_process').exec;

let alertLevel_Normal = 1;
let alertLevel_High = 2;
let alertLevel_Critical = 3;

let kChannel = '#sg-server';
let kBotUsername = 'sg_server_bot';

/**
 * Execute command with specified callback
 * @param  {String}   command  Command string
 * @param  {Function} callback callback function(output)
 */
function execute(command, callback) {
	exec(command, function(error, stdout, stderr) { callback(stdout); });
};

/**
 * Notify to slack with level of alert.
 * @param  {String} message    Message to send to slack
 * @param  {Number} alertLevel Alert level. 1-3
 */
function notifySlack(message, alertLevel) {
	slack.webhook({
		channel: kChannel,
		username: kBotUsername,
		text: message + "\nLevel: *" + getAlertLevelName(alertLevel) + "*"
	}, function(err, response) {
		if (err == null) {
			console.log("notified message to slack successfully");
			console.log("---");
			console.log(message + " with level " + alertLevel);
			console.log("---");
		}
		else {
			console.log("---");
			console.log("notified message to slack failed");
			console.log("---");
		}
	});
}

/**
 * Return alert level name from level number.
 * @param  {Number} level Level number
 * @return {String}       Level number name
 */
function getAlertLevelName(level) {
	if (level == 1) {
		return "Normal";
	}
	else if (level == 2) {
		return "High";
	}
	else if (level == 3) {
		return "Critical";
	}
}

// get webhook from env variable
let webhookUrl = process.env.SGSERVER_WEBHOOK;
// create slack
let slack = new SlackNode();
slack.setWebhook(webhookUrl);

// set good interval, not too short!!
// in ms
let waitInterval = 600000;

var intetvalID = setInterval(function() {

	// # check if port 80 is listening at the moment or not
	execute("lsof -i :80", function(output) {
		if (output == null || output === "") {
			// process die, notify slack
			notifySlack("`http` process is down (port `80`)", 3);
		}
	});

}, waitInterval);
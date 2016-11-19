var wajs = require('wajs');
var waClient = new wajs("2GGY3Y-X44843666P");

var queryString = 'indefinite integral of open paren ten x squared plus sin x squared close paren plus five x';
var queryString2 = 'first derivative of open paren ten x squared plus sin x squared close paren plus five x';
var queryString3 = 'open paren ten x squared plus sin x squared minus eleven x squared close paren plus five x';

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

var unenglishify = function(text) {
	return  text.replaceAll("open paren ", "(").replaceAll(" close paren", ")").replaceAll(" squared", "^2").replaceAll(" cubed", "^3")
				.replaceAll(" plus ", "+").replaceAll(" minus ", "-").replaceAll(" times ", "*").replaceAll(" divided ", "/").replaceAll(" equals ", "=")
				.replaceAll("zero", "0").replaceAll("one", "1").replaceAll("two", "2").replaceAll("three", "3").replaceAll("four", "4")
				.replaceAll("five", "5").replaceAll("six", "6").replaceAll("seven", "7").replaceAll("eight", "8").replaceAll("nine", "9")
				.replaceAll("ten", "10").replaceAll("eleven", "11").replaceAll("twelve", "12").replaceAll("thirteen", "13")
				.replaceAll("fourteen", "14").replaceAll("fifteen", "15").replaceAll("sixteen", "16").replaceAll("seventeen", "17")
				.replaceAll("eighteen", "18").replaceAll("nineteen", "19");
}

var englishify = function(text) {
	return  text.replaceAll("~~", " approximately equals ").replaceAll("\n", " ")
				.replaceAll("  ", " ").replace(/_\((.+)\)\^/g, " from $1 to ");
}

// use the client to send a query
/*waClient.query(queryString2).then(function(qr) {
	var pods = JSON.parse(qr.toJson());

	var resultObj = {};

	for (var i = 0; i < pods.pod.length; i++) {
		var pod = pods.pod[i];
		var podTitle = pod.title;

		if (podTitle === "Plots") {
			continue;
		}

		var subPodTexts = [];

		for (var j = 0; j < pod.subpod.length; j++) {
			var subPodTitle = pod.subpod[j].title.trim();
			var subPodText = pod.subpod[j].plaintext[0].trim();

			subPodTexts.push((subPodTitle ? subPodTitle + " equals " : "") + englishify(subPodText));
		}

		if (subPodTexts.length) {
			resultObj[podTitle] = subPodTexts;
		}
	}

	console.log(JSON.stringify(resultObj, null, 2));
	var keys = Object.keys(resultObj);
	var response = "Here are some answers and information: ";
	
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var values = resultObj[key];
		response += "The " + key + ((values.length > 2) ? " are " : " is ");

		for (var j = 0; j < values.length; j++) {
			var value = values[j];
			response += value;

			if ((j + 1) < values.length) {
				response += ", and ";
			} else {
				if ((i + 1) < keys.length) {
					response += ". ";
				}
			}
		}
	}

	response += ".";
	console.log(response);
	//console.log(queryString2);
	//console.log(unenglishify(queryString2));
})
.catch(function(err) {
	console.log(err);
})*/

var alexa = require('alexa-utils');
const PORT = process.env.PORT || 8080;

var app = alexa.app("CalculusBuddy")
	.onLaunch(function(req, res) {
		res.prompt("Hello there. What would you like me to solve?")
			.reprompt("What would you like me to solve?")
			.endSession(false)
			.send();
	})
	.onIntent("SolveQuestion", function(req, res) {
		var input = req.intent.slot("input");

		if (input) {
			waClient.query(input).then(function(qr) {
				var pods = JSON.parse(qr.toJson());

				var resultObj = {};

				for (var i = 0; i < pods.pod.length; i++) {
					var pod = pods.pod[i];
					var podTitle = pod.title;

					if (podTitle.toLowerCase().includes("plot") || podTitle === "Alternate forms") {
						continue;
					}

					var subPodTexts = [];

					for (var j = 0; j < pod.subpod.length; j++) {
						var subPodTitle = pod.subpod[j].title.trim();
						var subPodText = pod.subpod[j].plaintext[0].trim();

						subPodTexts.push((subPodTitle ? subPodTitle + " equals " : "") + englishify(subPodText));
					}

					if (subPodTexts.length) {
						resultObj[podTitle] = subPodTexts;
					}
				}

				console.log(JSON.stringify(resultObj, null, 2));
				var keys = Object.keys(resultObj);
				var response = "<speak>Here are some answers and information: ";
				
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					var values = resultObj[key];
					response += "<s>The " + key + ((values.length > 2) ? " are " : " is ");

					for (var j = 0; j < values.length; j++) {
						var value = values[j];
						response += value;

						if ((j + 1) < values.length) {
							response += ", and ";
						} else {
							if ((i + 1) < keys.length) {
								response += ".</s>";
							}
						}
					}
				}

				response += ".</s></speak>";
				console.log(response);

				res.prompt(response).endSession(true).send();
			})
			.catch(function(err) {
				console.log(err);
			})
		} else {
			res.prompt("I didn't quite hear what you wanted me to compute. Could you repeat your command again?")
				.endSession(false)
				.send();
		}
	})
	.onIntent("AMAZON.StopIntent", function(req, res) {
		res.prompt("All right, goodbye!").endSession(true).send();
	})
	.onIntent("AMAZON.CancelIntent", function(req, res) {
		res.prompt("All right, goodbye!").endSession(true).send();
	})
	.onIntent("AMAZON.HelpIntent", function(req, res) {
		var prompt = "You can ask me to do any math function, such as 'intergrate x squared plus five', or 'find the roots of x squared minus two x plus one'. You can also say stop or cancel if you are done.";
		res.prompt(prompt).endSession(false).send();
	})
	.onSessionEnd(function(req, res) {
		res.prompt("All right, goodbye!")
			.endSession(true)
			.send();
	})
	.host("/solve", PORT, false, true);

console.log("Server started on port " + PORT);
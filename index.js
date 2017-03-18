var wajs = require('wajs');
var waClient = new wajs(/*process.env.wa_key*/"2GGY3Y-X44843666P");
var fs = require('fs');
var firebase = require('firebase');
//J6HA6V-YHRLHJ8A8Q

var queryString1 = 'indefinite integral of open paren ten x squared plus sin x squared close paren plus five x';
var queryString2 = 'first derivative of open paren ten x squared plus sin x squared close paren plus five x';
var queryString3 = 'open paren ten x squared plus sin x squared minus eleven x squared close paren plus five x';
var queryString4 = 'if x = 2y + 3 and y = 5 x - 2 solve';
var queryString5 = 'roots of x ^ 2 - 2';
var queryString6 = 'is x^2 an even function';
var queryString7 = 'equation sine theta equals one divided by square root of two, solve for theta';

var qsArray = [
  {qs: queryString1, file: 'test/test1.txt'},
  {qs: queryString2, file: 'test/test2.txt'},
  {qs: queryString3, file: 'test/test3.txt'},
  {qs: queryString4, file: 'test/test4.txt'},
  {qs: queryString5, file: 'test/test5.txt'},
  {qs: queryString6, file: 'test/test6.txt'},
  {qs: queryString7, file: 'test/test7.txt'}
];

var POD_STATES = {
  STEP_BY_STEP_SOLUTION: 'Result__Step-by-step solution',
  APPROX_FORM: 'Result__Approximate form'
};

var unenglishRuleMap = [
  {orig: "open paren ", new: "("},
  {orig: " close paren", new: ")"},
  {orig: " squared", new: "^2"},
  {orig: " cubed", new: "^3"},
  {orig: " plus ", new: "+"},
  {orig: " minus ", new: "-"},
  {orig: " times ", new: "*"},
  {orig: " divided ", new: "/"},
  {orig: " equals ", new: "="},
  {orig: "zero", new: "0"},
  {orig: "one", new: "1"},
  {orig: "two", new: "2"},
  {orig: "three", new: "3"},
  {orig: "four", new: "4"},
  {orig: "five", new: "5"},
  {orig: "six", new: "6"},
  {orig: "seven", new: "7"},
  {orig: "eight", new: "8"},
  {orig: "nine", new: "9"},
  {orig: "ten", new: "10"},
  {orig: "eleven", new: "11"},
  {orig: "twelve", new: "12"},
  {orig: "thirteen", new: "13"},
  {orig: "fourteen", new: "14"},
  {orig: "fifteen", new: "15"},
  {orig: "sixteen", new: "16"},
  {orig: "seventeen", new: "17"},
  {orig: "eighteen", new: "18"},
  {orig: "nineteen", new: "19"}
];

var englishRuleMap = [

];

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

var unenglishify = function(text) {
  for (var ueRule of unenglishRuleMap) {
    text = text.replaceAll(ueRule.orig, ueRule.new);
  }

  return text;
  /*return text
          .replaceAll("open paren ", "(")
          .replaceAll(" close paren", ")")
          .replaceAll(" squared", "^2")
          .replaceAll(" cubed", "^3")
          .replaceAll(" plus ", "+")
          .replaceAll(" minus ", "-")
          .replaceAll(" times ", "*")
          .replaceAll(" divided ", "/")
          .replaceAll(" equals ", "=")
          .replaceAll("zero", "0")
          .replaceAll("one", "1")
          .replaceAll("two", "2")
          .replaceAll("three", "3")
          .replaceAll("four", "4")
          .replaceAll("five", "5")
          .replaceAll("six", "6")
          .replaceAll("seven", "7")
          .replaceAll("eight", "8")
          .replaceAll("nine", "9")
          .replaceAll("ten", "10")
          .replaceAll("eleven", "11")
          .replaceAll("twelve", "12")
          .replaceAll("thirteen", "13")
          .replaceAll("fourteen", "14")
          .replaceAll("fifteen", "15")
          .replaceAll("sixteen", "16")
          .replaceAll("seventeen", "17")
          .replaceAll("eighteen", "18")
          .replaceAll("nineteen", "19");*/
}

var englishify = function(text) {
  return  text.replaceAll("~~", " approximately equals ")
              //.replaceAll("\n", " ")
              .replaceAll("  ", " ")
              .replace(/_\((.+)\)\^/g, " from $1 to ");
}

// use the client to send a query

var process = function(qstring) {
  waClient.query(qstring.qs, {
    excludePodId: ['Plot', 'PlotOfSolutionSet', 'PlotOfSolutionSet', 'RootPlot', 'NumberLine'],
    includePodId: ['Input', 'Result'],
    //podState: 'Result__Step-by-step solution'
    format: 'image' //doing 'plaintext' gives some janky characters
  })
  .then(function(qr) {
    console.log('Writing to ' + qstring.file);
    fs.writeFileSync(qstring.file, JSON.stringify(JSON.parse(qr.toJson()), null, 2));
    for (var pod of qr.pods()) {
      console.log(pod.id);
    };
    {
      /*for (var pod of qr.pods()) {
        //console.log(pod);
        var title = pod.getTitle();
        
        if (title.toLowerCase().includes("plot"))
          continue;
        console.log(title)
    
        for (var subpod of pod.subPods()) {
          //console.log(JSON.stringify(subpod.getPlainText(), null, 2))
          console.log(subpod);
          var subTitle = subpod.getTitle();
    
          console.log((subTitle ? subTitle + " equals " : "") + " => " + englishify(subpod.getPlainText()[0]).replace(/\uF74Cx\uF7D9/g, "test"));
        }//\uF74E \uF74D
      }*/
      /*var pods = JSON.parse(qr.toJson());
      console.log(qr.toJson());
      console.log(qr.error());
    
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
      console.log(response);*/
      //console.log(queryString2);
      //console.log(unenglishify(queryString2));
    }
  })
  .catch(function(err) {
    console.log(err);
  });
}

for (var qstring of qsArray) {
  process(qstring);
}

/*var alexa = require('alexa-utils');
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
            if (value === "") value = "unknown";
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
  .host("/solve", PORT, false);

console.log("Server started on port " + PORT);*/
//exports.handler = app.lambda();
/*var express = require("express");
var alexa = require("alexa-app");

var PORT = process.env.PORT || 8080;
var app = express();

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("test");

alexaApp.express({
  expressApp: app,
  router: express.Router(),

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: true,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: false
});

// now POST calls to /test in express will be handled by the app.request() function

alexaApp.launch(function(request, response) {
  response.say("You launched the app!");
});

alexaApp.post = function(request, response, type, exception) {
  if (exception) {
    // always turn an exception into a successful response
    console.log("An error occured: " + exception);
  }
};

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));*/


/*var express = require("express");
var alexa = require("alexa-app");

var PORT = process.env.PORT || 8080;
var app = express();

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("calculus-buddy");

alexaApp.express({
  expressApp: app,

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: false,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: true
});

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
app.set("view engine", "ejs");

alexaApp.launch(function(request, response) {
  response.say("You launched the app!");
});

alexaApp.dictionary = { "names": ["matt", "joe", "bob", "bill", "mary", "jane", "dawn"] };

alexaApp.intent("nameIntent", {
    "slots": { "NAME": "LITERAL" },
    "utterances": [
      "my {name is|name's} {names|NAME}", "set my name to {names|NAME}"
    ]
  },
  function(request, response) {
    response.say("Success!");
  }
);

//

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));*/
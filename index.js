var nerdamer = require('nerdamer');
var algebrite = require('algebrite');
var mathjs = require('mathjs');

var fs = require('fs');
var firebase = require('firebase');

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
  {orig: /~~/g, new: " approximately equals "},
  {orig: /  /g, new: " "},
  {orig: /_\((.+)\)\^/g, new: " from $1 to "}
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
}

var englishify = function(text) {
  return text.replaceAll("~~", " approximately equals ")
             .replaceAll("  ", " ")
             .replace(/_\((.+)\)\^/g, " from $1 to ");
}

for (var qstring of qsArray) {
  ;
}
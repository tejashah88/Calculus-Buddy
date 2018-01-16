from flask import Flask
from flask_ask import Ask, statement, question, session
from sympy import *
from text2num import text2num, number_words

app = Flask(__name__)
ask = Ask(app, '/')

# Generic Stuff
@ask.launch
def launched():
  return question("Hello, I'm your calculus buddy! What would you like to do?")

@ask.intent('AMAZON.HelpIntent')
def help():
  help_text = render_template('help')
  return question(help_text).reprompt(help_text)


@ask.intent('AMAZON.StopIntent')
def stop():
  bye_text = render_template('bye')
  return statement(bye_text)

@ask.intent('AMAZON.CancelIntent')
def cancel():
  bye_text = render_template('bye')
  return statement(bye_text)

@ask.session_ended
def session_ended():
  return "{}", 200

# Helper functions
def text2math(text):
  return text \
  .replace(" plus ", "+") \
  .replace(" minus ", "-") \
  .replace(" times ", "*") \
  .replace(" divide ", "/") \
  .replace(" divided ", "/") \
  .replace(" divided by ", "/") \
  .replace(" equals ", "=") \



# Fun stuff

@ask.intent('SimplifyExpression')
def simplifyExpr(input):
  speech_text = "Hello %s" % firstname
  return statement(speech_text).simple_card('Hello', speech_text)

# Start the server
if __name__ == '__main__':
  # app.run()
  x = Symbol('x')
  test = simplify(sin(x)**2 / cos(x)**2)
  print(test)
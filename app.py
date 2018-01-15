from flask import Flask
from flask_ask import Ask, statement, question, session
from sympy import *

app = Flask(__name__)
ask = Ask(app, '/')

@ask.launch
def launched():
  return question('Hello, world!')

@ask.session_ended
def session_ended():
  return "", 200

@ask.on_session_started
def new_session():
  print('new session started')

@ask.intent('HelloIntent')
def hello(firstname):
  speech_text = "Hello %s" % firstname
  return statement(speech_text).simple_card('Hello', speech_text)

if __name__ == '__main__':
  app.run()
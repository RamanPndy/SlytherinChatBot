// MessageParser starter code in MessageParser.js
class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();
    if(lowerCaseMessage.includes("hi")){
      this.actionProvider.getNextQuestion("Hi")
    } else {
      this.actionProvider.getNextQuestion(lowerCaseMessage)
    }
  }
}

export default MessageParser;

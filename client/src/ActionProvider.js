import socketIOClient from "socket.io-client";
import {Component} from "react";

import config from './config';

const socket = socketIOClient(config.SOCKETENDPOINT);

class ActionProvider extends Component{
  constructor(createChatBotMessage, setStateFunc) {
    super();
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  urlify = (text) => {
    var urlRegex = /(https?:\/\/[^ ]*)/;
    var url = text.match(urlRegex);
    return url ? url[1] : null
  }

  getNextQuestion = (data) => {
    socket.emit("inputMsg", data);
    socket.once("outputMsg", (data) => {
      const message = this.createChatBotMessage(data.text, {
        widget: data.type,
      });
      this.updateChatbotState(message);
      console.log(data.text)
      var seatLayoutPageUrl = this.urlify(data.text)
      if (seatLayoutPageUrl) {
        console.log("movie seat layout link ", seatLayoutPageUrl)
        setTimeout(function(){ window.location.href = seatLayoutPageUrl }, config.REDIRECTIONTIMEOUT);
      }
    });
  }

  updateChatbotState(message) {
    // NOTICE: This function is set in the constructor, and is passed in from the top level Chatbot component. The setState function here actually manipulates the top level state of the Chatbot, so it's important that we make sure that we preserve the previous state.

    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider;

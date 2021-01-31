import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";

import LearningOptions from "./components/LearningOptions/LearningOptions";
import LinkList from "./components/LinkList/LinkList";
import TextComponent from "./components/Text/Text"
import RadioComponent from "./components/Radio/RadioComponent"
import DropDownComponent from "./components/dropdown/DropDownComponent";

const config = {
  SOCKETENDPOINT : "http://127.0.0.1:3001",
  REDIRECTIONTIMEOUT : 3000,
  botName: "SlytherinChatBot",
  initialMessages: [
    createChatBotMessage("Hi, Welcome to SlytherinChatBot :-). Please make selection from below options.", {
      widget: "button",
    }),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#376B7E",
    },
  },
  widgets: [
    {
      widgetName: "TextComponent",
      widgetFunc: (props) => <TextComponent {...props} />,
    },
    {
      widgetName: "button",
      widgetFunc: (props) => <LearningOptions {...props} />,
    },
    {
      widgetName: "radio",
      widgetFunc: (props) => <RadioComponent {...props}/>
    },
    {
      widgetName: "dropdown",
      widgetFunc: (props) => <DropDownComponent {...props}/>,
      mapStateToProps: ["test1" , "arun"],
    },
    {
      widgetName: "slider",
      widgetFunc: (props) => <LinkList {...props} />,
      props: {
        options: [
          {
            text: "Introduction to JS",
            url:
              "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/",
            id: 1,
          },
          {
            text: "Mozilla JS Guide",
            url:
              "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
            id: 2,
          },
          {
            text: "Frontend Masters",
            url: "https://frontendmasters.com",
            id: 3,
          },
        ],
      },
    },
  ],
};

export default config;

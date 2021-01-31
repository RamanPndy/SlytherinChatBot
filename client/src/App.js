import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "./App.css";

import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import config from "./config";
import chatIcon from "../src/assets/chaticon.png";

function App() {
  const [toggleIcon, setToggleIcon] = useState(true);
  //Component Did Mount Events
  const onToggleChatIcon = () => {
    setToggleIcon(!toggleIcon);
  };

  return (
    <div className="App">
      <header className="App-header">
        {toggleIcon ? (
          <Chatbot
            config={config}
            actionProvider={ActionProvider}
            messageParser={MessageParser}
          />
        ) : null}

        <div className="chat-icon">
          <img
            src={chatIcon}
            name="slytherinchatbot"
            style={{ width: "70px", cursor: "pointer" }}
            onClick={onToggleChatIcon}
          ></img>
        </div>
      </header>
    </div>
  );
}

export default App;

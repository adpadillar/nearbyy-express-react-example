import React, { useState } from "react";
import { Message } from "./components/message";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]); // the array of messages
  const [currentMessage, setCurrentMessage] = useState(""); // the user's input state when typing a message

  function handleSend() {
    // copy the currentMessage into a new variable
    // const oldMessage = currentMessage;

    // messages = [1, 2, 3, 4]
    // newArray = [...messages, 5]

    // add the currentMessage to the messages array
    // inmediately after the user sends the message
    setMessages([...messages, currentMessage]);
    setCurrentMessage("");

    fetch(`http://localhost:4000/chat?message=${currentMessage}`)
      .then((res) => res.text())
      .then((answer) => setMessages([...messages, currentMessage, answer]))
      .catch((err) => console.error(err));
  }

  // 0. user -> even
  // 1. ai -> odd
  // 2. user -> even
  // 3. ai -> odd

  return (
    <div>
      <h1>Chatbot</h1>
      <div>
        {messages.map((message, index) => (
          <Message key={index} type={index % 2 === 1 ? "ai" : "human"}>
            {message}
          </Message>
        ))}
      </div>
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send message</button>
    </div>
  );
}

export default App;

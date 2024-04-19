import React, { useState } from "react";
import { Message } from "./components/message";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  function handleSend() {
    const oldMessage = currentMessage;

    setMessages([...messages, currentMessage]);
    setCurrentMessage("");

    fetch(`http://localhost:4000/chat?message=${currentMessage}`)
      .then((res) => res.text())
      .then((data) => {
        setMessages([...messages, oldMessage, data]);
      })
      .catch((err) => console.error(err));
  }

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
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default App;

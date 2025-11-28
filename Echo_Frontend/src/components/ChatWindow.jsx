// src/components/ChatWindow.jsx
import React, { useState } from "react";

const Message = ({ text, from }) => (
  <div className={`message ${from === "me" ? "me" : "bot"}`}>
    <div className="message-bubble">{text}</div>
  </div>
);

const ChatWindow = ({ messages = [] }) => {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(messages);

  const send = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { text: input.trim(), from: "me" }]);
    setInput("");
    // Sample bot reply
    setTimeout(() => {
      setMsgs((m) => [...m, { text: "Thanks! Here's a sample reply from Echo.", from: "bot" }]);
    }, 600);
  };

  const onKey = (e) => {
    if (e.key === "Enter") send();
  };

  return (
    <div className="chat-window">
      <div className="chat-area">
        {msgs.map((m, i) => <Message key={i} {...m} />)}
      </div>

      <div className="chat-input">
        <input
          placeholder="Write a message to Echo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button className="send-btn" onClick={send}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;

// src/components/ChatHistory.jsx
import React from "react";

const ConversationItem = ({ title, subtitle, time }) => (
  <div className="conv-item">
    <div className="conv-meta">
      <div className="conv-title">{title}</div>
      <div className="conv-sub">{subtitle}</div>
    </div>
    <div className="conv-time">{time}</div>
  </div>
);

const ChatHistory = ({ items = [] }) => {
  return (
    <div className="chat-history">
      <div className="history-header">
        <h3>Last Chats</h3>
        {/* <button className="small-btn">New</button> */}
      </div>

      <div className="history-list">
        {items.map((it, idx) => (
          <ConversationItem key={idx} {...it} />
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;

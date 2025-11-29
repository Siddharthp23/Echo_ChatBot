// src/components/ChatHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// small item component
const ConversationItem = ({ title, subtitle, time }) => (
  <div className="conv-item">
    <div className="conv-meta">
      <div className="conv-title">{title}</div>
      <div className="conv-sub">{subtitle}</div>
    </div>
    <div className="conv-time">{time}</div>
  </div>
);

const ChatHistory = ({ apiBase = "http://127.0.0.1:8000" }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstNWords = (text = "", n = 5) => {
    if (!text) return "";
    // strip markdown headings and newlines for preview
    const cleaned = text.replace(/[#*_>`~\-]{1,}/g, " ").replace(/\s+/g, " ").trim();
    return cleaned.split(" ").slice(0, n).join(" ") + (cleaned.split(" ").length > n ? "..." : "");
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setItems([]);
          return;
        }

        const res = await axios.get(`${apiBase}/api/chat/chat/chat_details`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data || [];
        // map to UI-friendly entries
        const mapped = data.map((d) => {
          // format time
          let time = "";
          if (d.created_at) {
            try {
              time = new Date(d.created_at).toLocaleString();
            } catch (e) {
              time = d.created_at;
            }
          }
          return {
            title: d.query || "Untitled",
            subtitle: firstNWords(d.answer || "", 5),
            time,
            pdf_url: d.pdf_url
          };
        });

        setItems(mapped);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [apiBase]);

  return (
    <div className="chat-history">
      <div className="history-header">
        <h2>Last Chats</h2>
      </div>

      <div className="history-list">
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div>No chats yet</div>
        ) : (
          items.map((it, idx) => <ConversationItem key={idx} {...it} />)
        )}
      </div>
    </div>
  );
};

export default ChatHistory;

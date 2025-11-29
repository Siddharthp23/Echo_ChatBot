// src/components/ChatWindow.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

/**
 * ChatWindow
 * - sends { user_query } to POST /api/chat/chat
 * - expects response: { answer: string, pdf_url?: string|null }
 * - uses localStorage.access_token as "Bearer <token>"
 *
 * Adjust CHAT_ENDPOINT and API_BASE if your backend is hosted elsewhere.
 */

const API_BASE = "http://127.0.0.1:8000"; // change if backend host differs
const CHAT_ENDPOINT = `${API_BASE}/api/chat/chat/chat`; // keep consistent with backend route

const Message = ({ text, from, pdfUrl }) => (
  <div className={`message ${from === "me" ? "me" : "bot"}`}>
    <div className="message-bubble">
      <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
      {pdfUrl ? (
        <div style={{ marginTop: 8 }}>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Download PDF</a>
        </div>
      ) : null}
    </div>
  </div>
);

const ChatWindow = ({ initialMessages = [] }) => {
  // ensure we always have at least one welcome message
  const welcome = {
    text: "Hello! I’m Echo — ask me to create concise exam-ready engineering notes. Type a subject/topic and press Send.",
    from: "bot"
  };

  const [msgs, setMsgs] = useState(() => (initialMessages.length ? initialMessages : [welcome]));
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const typingRef = useRef(null);

  // Helper: append a new message to chat
  const pushMessage = (m) => setMsgs((prev) => [...prev, m]);

  // animate text into an existing message by index
  const animateText = (fullText, idxOfMessage, onComplete) => {
    const chunkMs = 10; // ms per char
    let i = 0;
    if (typingRef.current) clearInterval(typingRef.current);

    typingRef.current = setInterval(() => {
      i++;
      setMsgs((prev) => {
        const copy = [...prev];
        if (!copy[idxOfMessage]) return prev;
        copy[idxOfMessage] = { ...copy[idxOfMessage], text: fullText.slice(0, i) };
        return copy;
      });
      if (i >= fullText.length) {
        clearInterval(typingRef.current);
        typingRef.current = null;
        if (onComplete) onComplete();
      }
    }, chunkMs);
  };

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // add user's message
    pushMessage({ text: trimmed, from: "me" });
    setInput("");
    setSending(true);

    // add a temporary bot "typing..." message and get its index
    setMsgs((prev) => {
      const copy = [...prev, { text: "Echo is typing...", from: "bot", isTemp: true }];
      return copy;
    });

    // get the index of the temp bot message after it was appended
    await new Promise((r) => setTimeout(r, 0)); // yield to allow state to update
    const tempBotIndex = msgs.length; // msgs was previous state; new bot msg is at this index

    // token key: use 'access_token' (adjust if you use a different key)
    const token = localStorage.getItem("token");
    if (!token) {
      // replace last message with guest error
      setMsgs((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { text: "You are not logged in. Please log in to use Echo.", from: "bot" };
        return copy;
      });
      setSending(false);
      return;
    }

    try {
      const resp = await axios.post(
        CHAT_ENDPOINT,
        { user_query: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = resp.data || {};
      const answerText = data.answer ?? "";
      const pdfUrlRaw = data.pdf_url ?? data.pdf ?? null;
      const pdfUrl = pdfUrlRaw ? (pdfUrlRaw.startsWith("http") ? pdfUrlRaw : `${API_BASE}${pdfUrlRaw}`) : null;

      // replace temporary bot message with an empty message to animate into
      setMsgs((prev) => {
        const copy = [...prev];
        // find the last temp message index
        const lastTempIdx = copy.map((m) => m.isTemp).lastIndexOf(true);
        const idx = lastTempIdx === -1 ? copy.length - 1 : lastTempIdx;
        copy[idx] = { text: "", from: "bot", pdfUrl: null };
        return copy;
      });

      // allow state to flush then animate text into the last bot message
      setTimeout(() => {
        setMsgs((prev) => {
          const copy = [...prev];
          const botIdx = copy.map((m) => m.from === "bot").lastIndexOf(true);
          if (botIdx === -1) copy.push({ text: "", from: "bot", pdfUrl: null });
          else copy[botIdx] = { ...copy[botIdx], text: "" };
          return copy;
        });

        setTimeout(() => {
          setMsgs((prev) => {
            const copy = [...prev];
            const botIdx = copy.map((m) => m.from === "bot").lastIndexOf(true);
            animateText(answerText, botIdx, () => {
              // set pdfUrl after animation completes
              setMsgs((prev2) => {
                const copy2 = [...prev2];
                if (copy2[botIdx]) copy2[botIdx] = { ...copy2[botIdx], pdfUrl };
                return copy2;
              });
            });
            // keep return value as-is since animateText will update state
            return copy;
          });
        }, 30);
      }, 20);

    } catch (err) {
      console.error("Chat API error:", err);
      // replace temp bot message with error
      setMsgs((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { text: "Failed to get response from server. Try again.", from: "bot" };
        return copy;
      });
    } finally {
      setSending(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter") send();
  };

  // scroll to bottom when msgs change
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs]);

  return (
    <div className="chat-window">
      <div className="chat-area" style={{ minHeight: 240, maxHeight: 480, overflowY: "auto", padding: 12 }}>
        {msgs.map((m, i) => (
          <Message key={i} text={m.text} from={m.from} pdfUrl={m.pdfUrl} />
        ))}
        <div ref={endRef} />
      </div>

      <div className="chat-input">
        <input
          placeholder="Write a message to Echo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          disabled={sending}
        />
        <button className="send-btn" onClick={send} disabled={sending}>
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

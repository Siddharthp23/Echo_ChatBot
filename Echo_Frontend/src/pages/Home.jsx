// src/pages/Home.jsx
import React from "react";
import NavBar from "../components/NavBar";
import ChatHistory from "../components/ChatHistory";
import ChatWindow from "../components/ChatWindow";
import "../styles/Home.css";
import avatarSrc from "../assets/echo_bot1.jpg"; 
import echoAvatar from "../assets/echo_bot1.jpg"; 

const sampleConversations = [
  { title: "Recommendation for colours", subtitle: "UI / branding tips", time: "2h" },
  { title: "How should my UX design...", subtitle: "UX critique", time: "Yesterday" },
  { title: "Project plan ideas", subtitle: "Brainstorm", time: "2 days" },
];

const sampleMessages = [
  { text: "Hello! I'm Echo. How can I help you today?", from: "bot" },
];

const Home = () => {
  return (
    <div className="home-page">
      <NavBar userName="James" avatar={avatarSrc} />

      <div className="home-body container">
        <aside className="left-panel">
          <ChatHistory items={sampleConversations} />
        </aside>

        <section className="right-panel">
          <div className="chat-header">
            <div className="chat-title">
              <img src={echoAvatar} alt="echo" className="echo-small" />
              <div>
                <div className="chat-with">Chat with</div>
                <div className="chat-name">Echo</div>
              </div>
            </div>

          
          </div>

          <ChatWindow messages={sampleMessages} />
        </section>
      </div>
    </div>
  );
};

export default Home;

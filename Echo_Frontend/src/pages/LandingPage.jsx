// src/pages/LandingPage.jsx
import React, { useState } from "react";
import "../styles/LandingPage.css";
import echo from "../assets/echo_bot1.jpg"; 
import LoginModal from "../components/LoginModel";
import RegistrationModal from "../components/RegistrationModel"; // ← NEW IMPORT

const Feature = ({ title, desc, icon }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <div>
      <h3>{title}</h3>
      <p className="small">{desc}</p>
    </div>
  </div>
);

const LandingPage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // ← NEW STATE

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const openRegister = () => setIsRegisterOpen(true);  // ← NEW FUNCTION
  const closeRegister = () => setIsRegisterOpen(false);

  const handleLogin = (creds) => {
    console.log("Login credentials:", creds);
    setIsLoginOpen(false);
  };

  const handleRegister = (data) => {   // ← NEW HANDLER
    console.log("Registration data:", data);
    setIsRegisterOpen(false);
  };

  return (
    <div className="landing-page">
      <div className="sidebar">
        <div className="logo">Echo</div>

        <div className="hero-content">
          <img src={echo} alt="Echo bot" className="robot" />
          <h1 className="title">Meet Echo!</h1>
          <h2 className="subtitle">
            Your <span>AI Assistant</span>
          </h2>

          <p className="lead description">
            All your questions will be answered by an AI assistant. Ask here, please!
          </p>

          <div className="cta-row">
            {/* Get Started now opens Registration Modal */}
            <button className="btn-primary" onClick={openRegister}>
              Get Started
            </button>

            {/* Circle CTA opens Login Modal */}
            <button
              className="circle-cta"
              title="Open chat / Login"
              aria-label="Open login"
              onClick={openLogin}
            >
              <span className="arrow">↗</span>
            </button>
          </div>
        </div>

        <footer className="side-footer small">
          © {new Date().getFullYear()} Echo. Built with React + Vite
        </footer>
      </div>

      <main className="main">
        <div className="container">
          <section className="features-section">
            <h2 className="h2">What Echo can do</h2>
            <p className="small" style={{ maxWidth: 700, marginTop: 8 }}>
              Echo answers questions, generates ideas, summarizes content and helps you stay productive — all in real time.
            </p>

            <div className="features-grid">
              <Feature
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                }
                title="Instant answers"
                desc="Ask anything and get concise, accurate responses instantly."
              />
              <Feature
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                }
                title="Context aware"
                desc="Remembers context within the session to give better follow-ups."
              />
              <Feature
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                }
                title="Sample Questions"
                desc="Use Echo to practise ample of Questions free of cost."
              />
            </div>
          </section>

          <section className="cta-section">
            <div className="cta-card">
              <div>
                <h3 className="h2">Ready to try Echo?</h3>
                <p className="small">Start a conversation or explore the docs to learn more.</p>
              </div>
              <div>
                <button className="btn-outline">View Docs</button>
                <button className="btn-primary" style={{ marginLeft: 12 }} onClick={openRegister}>
                  Launch App
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Login Modal */}
      <LoginModal open={isLoginOpen} onClose={closeLogin} onLogin={handleLogin} />

      {/* Registration Modal */}
      <RegistrationModal
        open={isRegisterOpen}
        onClose={closeRegister}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default LandingPage;

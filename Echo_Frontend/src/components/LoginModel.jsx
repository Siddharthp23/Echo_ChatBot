// src/components/LoginModal.jsx
import React from "react";
import "../styles/LoginModel.css";
import echoImg from "../assets/echo_bot1.jpg";

const LoginModal = ({ open, onClose, onLogin }) => {
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;
    // basic validation
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    // call parent callback if provided
    if (onLogin) onLogin({ email, password });
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-body">
          <aside className="modal-left">
            <img src={echoImg} alt="Echo" className="modal-echo" />
            <div className="modal-left-text">
              <h2>Welcome to Echo</h2>
              <p>Sign in to continue and get instant answers from your AI assistant.</p>
            </div>
          </aside>

          <section className="modal-right">
            <h3 className="login-title">Login</h3>
            <p className="login-sub">By logging in you agree to our Terms and Privacy Policy.</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="field">
                <span className="field-label">Email address</span>
                <input name="email" type="email" placeholder="you@example.com" required />
              </label>

              <label className="field">
                <span className="field-label">Password</span>
                <input name="password" type="password" placeholder="Enter your password" required />
              </label>

              <button type="submit" className="btn-primary login-btn">Login</button>

              <div className="login-alt">
                <span className="small">Or</span>
              </div>

              <button type="button" className="btn-social">
                <svg className="fb-icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M22 12a10 10 0 10-11.5 9.9v-7h-2.6v-3h2.6V9.1c0-2.6 1.5-4 3.8-4 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.7-1.6 1.4V12h2.7l-.4 3h-2.3v7A10 10 0 0022 12z"/></svg>
                Login with Facebook
              </button>

              <p className="signup">
                Don't have an account? <button type="button" className="link-btn">Create account</button>
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

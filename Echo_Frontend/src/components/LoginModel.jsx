// src/components/LoginModal.jsx
import React, { useState } from "react";
import "../styles/LoginModel.css";
import echoImg from "../assets/echo_bot1.jpg";
import { useNavigate } from "react-router-dom";

// ✅ Backend URL from env
const API_BASE = import.meta.env.VITE_BACKEND_URL;

const LoginModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/auth/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        alert(errData.detail || "Login failed");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // ✅ Save token + userId
      localStorage.setItem("token", data.access_token);
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
      }

      setLoading(false);
      onClose();

      // ✅ Redirect to home
      navigate("/home");

    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="modal-body">
          <aside className="modal-left">
            <img src={echoImg} alt="Echo" className="modal-echo" />
            <div className="modal-left-text">
              <h2>Welcome to Echo</h2>
              <p>
                Sign in to continue and get instant answers from your AI
                assistant.
              </p>
            </div>
          </aside>

          <section className="modal-right">
            <h3 className="login-title">Login</h3>
            <p className="login-sub">
              By logging in you agree to our Terms and Privacy Policy.
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="field">
                <span className="field-label">Email address</span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="field">
                <span className="field-label">Password</span>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </label>

              <button
                type="submit"
                className="btn-primary login-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

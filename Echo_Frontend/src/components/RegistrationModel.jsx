// src/components/RegistrationModal.jsx
import React, { useState } from "react";
import "../styles/RegistrationModel.css";
import echoImg from "../assets/echo_bot1.jpg";
import axios from "axios";

// ✅ Backend URL from environment variable
const API_BASE = import.meta.env.VITE_BACKEND_URL;
const REGISTER_ENDPOINT = `${API_BASE}/api/auth/api/register`;

const RegistrationModal = ({ open, onClose, onRegister }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  if (!open) return null;

  const showToast = (type, text, ms = 2500) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), ms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value.trim();
    const contact = form.contact.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!name || !contact || !email || !password) {
      showToast("error", "Please fill in all fields.");
      return;
    }

    if (!/^\d{7,15}$/.test(contact)) {
      showToast("error", "Please enter a valid contact number (7–15 digits).");
      return;
    }

    setLoading(true);
    try {
      const payload = { name, contact, email, password };

      const resp = await axios.post(REGISTER_ENDPOINT, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      if (resp.status >= 200 && resp.status < 300) {
        showToast("success", "Registered successfully");

        if (typeof onRegister === "function") {
          try {
            onRegister(resp.data);
          } catch {}
        }

        setTimeout(() => onClose?.(), 800);
      } else {
        showToast(
          "error",
          resp.data?.message || "Registration failed"
        );
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";

      showToast("error", msg);
      console.error("Register error:", err);
    } finally {
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
              <h2>Create your account</h2>
              <p>
                Join Echo to get instant AI help, store your chat history and
                personalize your experience.
              </p>
            </div>
          </aside>

          <section className="modal-right">
            <h3 className="login-title">Register</h3>
            <p className="login-sub">
              Enter your details to create an account.
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="field">
                <span className="field-label">Full name</span>
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </label>

              <label className="field">
                <span className="field-label">Contact number</span>
                <input
                  name="contact"
                  type="tel"
                  placeholder="9876543210"
                  required
                />
              </label>

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
                  placeholder="Create a password"
                  required
                />
              </label>

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <div className="login-alt">
                <span className="small">
                  By creating an account you agree to our Terms.
                </span>
              </div>
            </form>
          </section>
        </div>
      </div>

      {toast && (
        <div
          className={`simple-toast ${
            toast.type === "success"
              ? "toast-success"
              : "toast-error"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default RegistrationModal;

// src/components/RegistrationModal.jsx
import React from "react";
import "../styles/RegistrationModel.css";
import echoImg from "../assets/echo_bot1.jpg";

const RegistrationModal = ({ open, onClose, onRegister }) => {
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const contact = form.contact.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    // basic validation
    if (!name || !contact || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    // simple contact number validation (digits only, 7-15 chars)
    if (!/^\d{7,15}$/.test(contact)) {
      alert("Please enter a valid contact number (digits only).");
      return;
    }

    const payload = { name, contact, email, password };
    if (onRegister) onRegister(payload);
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-body">
          <aside className="modal-left">
            <img src={echoImg} alt="Echo" className="modal-echo" />
            <div className="modal-left-text">
              <h2>Create your account</h2>
              <p>Join Echo to get instant AI help, store your chat history and personalize your experience.</p>
            </div>
          </aside>

          <section className="modal-right">
            <h3 className="login-title">Register</h3>
            <p className="login-sub">Enter your details to create an account.</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="field">
                <span className="field-label">Full name</span>
                <input name="name" type="text" placeholder="John Doe" required />
              </label>

              <label className="field">
                <span className="field-label">Contact number</span>
                <input name="contact" type="tel" placeholder="9876543210" required />
              </label>

              <label className="field">
                <span className="field-label">Email address</span>
                <input name="email" type="email" placeholder="you@example.com" required />
              </label>

              <label className="field">
                <span className="field-label">Password</span>
                <input name="password" type="password" placeholder="Create a password" required />
              </label>

              <button type="submit" className="login-btn">Create Account</button>

              <div className="login-alt">
                <span className="small">By creating an account you agree to our Terms.</span>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;

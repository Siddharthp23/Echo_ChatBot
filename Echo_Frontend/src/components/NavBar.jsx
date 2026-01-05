// src/components/NavBar.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Backend URL from environment variable
const API_BASE = import.meta.env.VITE_BACKEND_URL;

const NavBar = ({ avatar }) => {
  const [userName, setUserName] = useState("Guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("[NavBar] token from localStorage:", token);

        if (!token) {
          if (mounted) {
            setUserName("Guest");
            setLoading(false);
          }
          return;
        }

        const url = `${API_BASE}/api/user/details`;
        console.log("[NavBar] requesting:", url);

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        console.log("[NavBar] response:", res.status, res.data);

        if (mounted && res?.data?.name) {
          setUserName(res.data.name);
        } else if (mounted) {
          setUserName("Guest");
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("[NavBar] request cancelled");
        } else {
          console.error(
            "[NavBar] fetchUserDetails error:",
            err?.response ?? err
          );
          setUserName("Guest");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUserDetails();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return (
    <nav className="echo-nav">
      <div className="nav-left">
        <button className="hamburger" aria-label="menu">
          ☰
        </button>
      </div>

      <div className="nav-right">
        <div className="greeting">
          <div className="hello">Hello,</div>
          <div className="name">
            <strong>{loading ? "Loading..." : userName}</strong>
          </div>
        </div>

        <div className="profile">
          <img
            src={avatar || "/default-avatar.png"}
            alt="profile"
            className="avatar"
          />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

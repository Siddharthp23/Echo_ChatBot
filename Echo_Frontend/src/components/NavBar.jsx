// src/components/NavBar.jsx
import React from "react";

const NavBar = ({ userName = "James", avatar }) => {
  return (
    <nav className="echo-nav">
      <div className="nav-left">
        <button className="hamburger" aria-label="menu">☰</button>
      </div>

      <div className="nav-right">
        {/* avatar first so greeting sits to its right */}
        
        <div className="greeting">
          <div className="hello">Hello,</div>
          <div className="name"><strong>{userName}</strong></div>
        </div>
        <div className="profile">
          <img src={avatar} alt="profile" className="avatar" />
        </div>

      </div>
    </nav>
  );
};

export default NavBar;

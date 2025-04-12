import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import WebLogo from "../assets/logos/WebLogo.png"  

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-pages">
      <img src = {WebLogo} alt="vdjLogo" className="logo" />
      <div className="page-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/book" className="nav-item">Book</Link>
        <Link to="/stream" className="nav-item">Stream</Link>
        <Link to="/contact" className="nav-item">Contact</Link>
      </div>
      </div>
      <div className="profile-icon">
        <Link to="/profile">👤</Link>
      </div>
    </nav>
  );
};

export default Navbar;

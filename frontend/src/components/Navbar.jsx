import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-pages">
      <h1 className="logo">VDJ</h1>
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

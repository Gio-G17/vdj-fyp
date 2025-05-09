import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import WebLogo from "../assets/logos/WebLogo.png"
import { HashLink } from 'react-router-hash-link';


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-pages">
        <img src={WebLogo} alt="vdjLogo" className="logo" />
        <div className="page-links">
          <Link to="/" className="nav-item">Home</Link>
          <HashLink
            to="#about"
            scroll={(el) => {
              const yOffset = -150; // adjust this number based on your navbar height
              const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: "smooth" });
            }}
            className="nav-item"
          >
            About
          </HashLink>

          <Link to="/bookings" className="nav-item">Book</Link>
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

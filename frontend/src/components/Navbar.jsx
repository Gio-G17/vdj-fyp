import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white">
      <h1 className="text-2xl font-bold">VDJ</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/book" className="hover:underline">Book</Link>
        <Link to="/stream" className="hover:underline">Stream</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
      </div>
      <div className="profile-icon">
        <Link to="/profile">👤</Link>
      </div>
    </nav>
  );
};

export default Navbar;

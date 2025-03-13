import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../../styles/signInPage.css"; // Ensure this file exists

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", formData);
      setMessage(response.data.message || "Login successful!");
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        
        {/* Forgot Password Link */}
        <Link to="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </Link>

        <button type="submit">Login</button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default SignInPage;

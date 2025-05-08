import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract token & email from URL
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {

    console.log("Reset Password Page Loaded"); // Debuggingß

    console.log("Token from URL:", token);
    console.log("Email from URL:", email);  

    if (!token || !email) {
      setMessage("Invalid or expired reset link.");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/auth/reset-password", {
        email,
        token,
        newPassword,
      });

      setMessage(response.data.message || "Password reset successful!");
      
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <p>Enter your new password below.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>

      <p>{message}</p>
    </div>
  );
};

export default ResetPasswordPage;

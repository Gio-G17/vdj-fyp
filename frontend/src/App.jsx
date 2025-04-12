import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/auth/SignUpPage"; // Import SignUpPage
import SignInPage from "./pages/auth/SignInPage"; // Import LoginPage
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"; // Import
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"; // Import Reset Password Page
import BookingsPage from "./pages/BookingsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Default Home Page */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} /> {/* New route */}
        <Route path="/bookings" element={<BookingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/auth/SignUpPage"; // Import SignUpPage
import SignInPage from "./pages/auth/SignInPage"; // Import LoginPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<SignInPage />} />
      </Routes>
    </Router>
  );
}

export default App;

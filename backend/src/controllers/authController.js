const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Temporary storage for reset tokens (for production, store in DB)
let resetTokens = {};

// Nodemailer Setup (Use your email credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email app password
  },
});

// ✅ **Register User**
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Hash password and save new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// ✅ **Login User**
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate a token (valid for 1 hour)
    const token = crypto.randomBytes(20).toString("hex");
    resetTokens[email] = { token, expires: Date.now() + 3600000 };

    // ✅ Fix: Encode email to prevent issues
    const resetLink = `http://localhost:5173/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    console.log("Sending Reset Link:", resetLink); // Debugging line

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};



exports.resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!resetTokens[email] || resetTokens[email].token !== token || resetTokens[email].expires < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    delete resetTokens[email]; // Remove used token

    res.json({ message: "Password successfully reset" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

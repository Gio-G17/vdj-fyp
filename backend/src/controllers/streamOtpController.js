const StreamOTP = require("../models/StreamOTP");
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ✅ Reuse same transporter as forgot password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ POST /api/otp/generate-stream
exports.generateStreamOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.body;

    // Invalidate old OTPs
    await StreamOTP.updateMany({ user: userId, bookingId }, { used: true });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const streamOtp = new StreamOTP({ user: userId, bookingId, otp, expiresAt });
    await streamOtp.save();

    // 🔥 Email the OTP to user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const message = `
      <h2>🎧 Your OTP to Join the Stream</h2>
      <p>Use the code below to access your stream room:</p>
      <h1 style="color: red;">${otp}</h1>
      <p>This OTP is valid for 10 minutes and can only be used once.</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your Stream Access OTP",
      html: message,
    });

    res.status(200).json({ message: "OTP generated and sent via email." });
  } catch (err) {
    console.error("Stream OTP Error:", err);
    res.status(500).json({ error: "Could not generate OTP" });
  }
};

// ✅ POST /api/otp/verify-stream
exports.verifyStreamOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId, otp } = req.body;

    const match = await StreamOTP.findOne({
      user: userId,
      bookingId,
      otp,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!match) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    match.used = true;
    await match.save();

    res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    console.error("Stream OTP Verification Error:", err);
    res.status(500).json({ error: "Could not verify OTP" });
  }
};

const User = require("../models/User");
const crypto = require("crypto");

exports.generateOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min expiry
    await user.save();

    // Send OTP via email or SMS (for now, just return it)
    res.json({ message: "OTP sent", otp });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.otp = null; // Clear OTP after successful verification
    await user.save();

    res.json({ message: "OTP verified, access granted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

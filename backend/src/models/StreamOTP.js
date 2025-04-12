const mongoose = require("mongoose");

const streamOtpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("StreamOTP", streamOtpSchema);

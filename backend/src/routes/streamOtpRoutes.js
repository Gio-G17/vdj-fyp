const express = require("express");
const router = express.Router();
const { generateStreamOtp, verifyStreamOtp } = require("../controllers/streamOtpController");
const authenticate = require("../middleware/authMiddleware");

router.post("/generate-stream", authenticate, generateStreamOtp);
router.post("/verify-stream", authenticate, verifyStreamOtp);

module.exports = router;

const express = require("express");
const { register, signin: signin, forgotPassword, resetPassword, getCurrentUser } = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword); // Ensure it's correctly imported
router.post("/reset-password", resetPassword); // Ensure it's correctly imported
router.get("/me", authenticate, getCurrentUser); // ✅ ADD THIS LINE

module.exports = router;

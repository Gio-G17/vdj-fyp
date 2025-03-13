const express = require("express");
const { register, login, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword); // Ensure it's correctly imported
router.post("/reset-password", resetPassword); // Ensure it's correctly imported

module.exports = router;

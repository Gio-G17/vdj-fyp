const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticate = require("../middleware/authMiddleware");

const ADMIN_EMAIL = "admin@vdj.com"; // Replace with your real admin email

// ✅ Middleware to allow only admin
const requireAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

// ✅ Get list of all users
router.get("/users", authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ Promote a user to DJ
router.post("/promote", authenticate, requireAdmin, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = "dj";
    await user.save();

    res.json({ message: `${email} promoted to DJ.` });
  } catch (err) {
    res.status(500).json({ error: "Failed to promote user" });
  }
});

// ✅ Demote DJ back to Client
router.post("/demote", authenticate, requireAdmin, async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });
  
      user.role = "client";
      await user.save();
  
      res.json({ message: `${email} demoted to Client.` });
    } catch (err) {
      res.status(500).json({ error: "Failed to demote user" });
    }
  });
  

module.exports = router;

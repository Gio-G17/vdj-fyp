// src/routes/userRoutes.js

const express = require("express");
const User = require("../models/User");

const router = express.Router();

// ✅ GET all DJs (return email and _id only)
router.get("/djs", async (req, res) => {
  try {
    const djs = await User.find({ role: "dj" }).select("name email _id");
    res.json(djs);
  } catch (error) {
    console.error("Error fetching DJs:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

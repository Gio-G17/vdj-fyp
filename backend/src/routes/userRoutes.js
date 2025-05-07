// src/routes/userRoutes.js

const express = require("express");
const User = require("../models/User");
const authenticate = require("../middleware/authMiddleware");


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

router.post("/socket/register", authenticate, (req, res) => {
  const userId = req.user.id;
  const { socketId } = req.body;

  if (!global.userSocketMap) {
    global.userSocketMap = {}; // ✅ Initialize it first
  }

  global.userSocketMap[userId] = socketId;

  res.json({ message: "Socket ID registered", userId, socketId });
});

// ✅ Get socket ID for a given user
router.get("/socket-id/:userId", (req, res) => {
  const { userId } = req.params;

  if (!global.userSocketMap) {
    return res.status(500).json({ error: "Socket map not initialized" });
  }

  const socketId = global.userSocketMap[userId];

  if (socketId) {
    return res.json({ socketId });
  } else {
    return res.status(404).json({ error: "Socket ID not found for user" });
  }
});


module.exports = router;

const express = require("express");
const DJ = require("../models/DJ");

const router = express.Router();

// ✅ GET all DJs
router.get("/", async (req, res) => {
  try {
    const djs = await DJ.find();
    res.json(djs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST a new DJ (for adding DJs to the database)
router.post("/", async (req, res) => {
  try {
    const { name, genre, image } = req.body;
    const newDJ = new DJ({ name, genre, image });
    await newDJ.save();
    res.status(201).json({ message: "DJ added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add DJ" });
  }
});

module.exports = router;

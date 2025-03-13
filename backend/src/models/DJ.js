const mongoose = require("mongoose");

const DJSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  image: { type: String, required: true }, // Store image URL
});

module.exports = mongoose.model("DJ", DJSchema);

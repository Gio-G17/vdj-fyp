const mongoose = require("mongoose");
const DJ = require("../models/DJ");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const djs = [
  { name: "DJ Ryan", genre: "Techno Music", image: "/images/dj-ryan.jpg" },
  { name: "DJ Sara", genre: "Commercial Music", image: "/images/dj-sara.jpg" },
  { name: "DJs AJ&J", genre: "House Music", image: "/images/djs-aj-j.jpg" },
  { name: "DJ Liza", genre: "R&B Music", image: "/images/dj-liza.jpg" },
];

const seedDB = async () => {
  await DJ.deleteMany({});
  await DJ.insertMany(djs);
  console.log("DJs added!");
  mongoose.connection.close();
};

seedDB();

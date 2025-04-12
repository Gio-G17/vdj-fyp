require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const djRoutes = require("./routes/djRoutes");
const contactRoutes = require("./routes/contactRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const streamOtpRoutes = require("./routes/streamOtpRoutes");



const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/djs", djRoutes); // ✅ Register DJ Routes
app.use("/api/contact", contactRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/otp", streamOtpRoutes);


app.get("/", (req, res) => res.send("Backend running..."));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getDJUnavailableSlots
} = require("../controllers/bookingController");

const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, createBooking);
router.get("/my", authenticate, getMyBookings);
router.get("/unavailable/:djId", getDJUnavailableSlots); // ✅ fixed call

module.exports = router;

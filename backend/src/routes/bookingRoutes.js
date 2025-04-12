const express = require("express");
const router = express.Router();
const { createBooking, getMyBookings } = require("../controllers/bookingController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, createBooking);
router.get("/my", authenticate, getMyBookings);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getDJUnavailableSlots,
  deleteBooking, // ✅ add this
} = require("../controllers/bookingController");

const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, createBooking);
router.get("/my", authenticate, getMyBookings);
router.get("/unavailable/:djId", getDJUnavailableSlots); // ✅ fixed call
router.delete("/:id", authenticate, deleteBooking);


module.exports = router;

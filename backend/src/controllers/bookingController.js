const Booking = require("../models/Booking");
const User = require("../models/User");

exports.createBooking = async (req, res) => {
  try {
    const { room, dj, date, time, name, phone, email, notes } = req.body;
    const userId = req.user.id;

    const booking = new Booking({
      user: userId,
      room,
      dj,
      date,
      time,
      name,
      phone,
      email,
      notes
    });

    await booking.save();
    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (err) {
    res.status(500).json({ error: "Error creating booking", details: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    let bookings;
    if (currentUser.role === "dj") {
      // Show bookings where this DJ is assigned
      bookings = await Booking.find({ dj: currentUser._id });
    } else {
      // Show bookings made by the client
      bookings = await Booking.find({ user: currentUser._id });
    }

    res.json(bookings);
  } catch (err) {
    console.error("❌ Booking fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};


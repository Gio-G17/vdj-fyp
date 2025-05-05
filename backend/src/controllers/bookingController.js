const Booking = require("../models/Booking");
const User = require("../models/User");

// exports.createBooking = async (req, res) => {
//   try {
//     const { room, dj, date, time, name, phone, email, notes } = req.body;
//     const userId = req.user.id;

//     const booking = new Booking({
//       user: userId,
//       room,
//       dj,
//       date,
//       time,
//       name,
//       phone,
//       email,
//       notes
//     });

//     await booking.save();
//     res.status(201).json({ message: "Booking confirmed", booking });
//   } catch (err) {
//     res.status(500).json({ error: "Error creating booking", details: err.message });
//   }
// };

exports.createBooking = async (req, res) => {
  try {
    const { room, dj, date, time, name, phone, email, notes } = req.body;
    const userId = req.user.id;

    const bookingDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    // 1. Prevent booking in the past
    if (bookingDateTime <= now) {
      return res.status(400).json({ error: "You cannot book a past time." });
    }

    // 2. Prevent double booking for the same DJ, date and time
    const existingBooking = await Booking.findOne({
      dj,
      date,
      time,
    });

    if (existingBooking) {
      return res.status(400).json({ error: "This time slot is already booked for the selected DJ." });
    }

    // Proceed to save
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
      bookings = await Booking.find({ user: currentUser._id});
    }

    res.json(bookings);
  } catch (err) {
    console.error("❌ Booking fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

exports.getDJUnavailableSlots = async (req, res) => {
  try {
    const { djId } = req.params;

    const bookings = await Booking.find({ dj: djId });

    const unavailable = bookings.map(b => ({
      date: b.date, // format: 'YYYY-MM-DD'
      time: b.time  // format: 'HH:mm'
    }));

    res.json(unavailable);
  } catch (err) {
    res.status(500).json({ error: "Error fetching unavailable slots" });
  }
};

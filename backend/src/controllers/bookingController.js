const Booking = require("../models/Booking");

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
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

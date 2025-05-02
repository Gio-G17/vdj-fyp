import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import BookingFormModal from "../components/BookingFormModal";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
    } else {
      fetchBookings();
    }
  }, []);

  if (loading) return <p style={{ color: "white" }}>Loading bookings...</p>;


  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>
      <button onClick={() => setOpenModal(true)}>New Booking</button>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id} style={{ marginBottom: "12px" }}>
              {booking.date} @ {booking.time} — {booking.room} with {booking.dj}
              <br />
              <Link to={`/access-room/${booking._id}`}>
                <button style={{ marginTop: "6px" }}>Go to Room</button>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <BookingFormModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        onBookingSuccess={fetchBookings}
      />
    </div>
  );
};

export default BookingsPage;

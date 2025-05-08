import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import BookingFormModal from "../components/BookingFormModal";
import "../styles/bookings.css"; // 🔗 Link to your plain CSS file
import TrashIcon from "../assets/icons/trashCanIcon.png"; // or .png

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [djList, setDjList] = useState([]);

  const fetchDJs = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/users/djs");
      setDjList(res.data);
    } catch (err) {
      console.error("Failed to fetch DJs", err);
    }
  };
  
  const getDJName = (djId) => {
    const found = djList.find((dj) => dj._id === djId);
    return found?.name || "Unknown DJ";
  };
  
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

  const deleteBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBookings(); // Refresh after delete
    } catch (err) {
      console.error("Failed to delete booking", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    } else {
      fetchBookings();
      fetchDJs(); // ✅ fetch all DJs here

    }
  }, []);

  if (loading) return <p className="loading-text">Loading bookings...</p>;

  return (
    <div className="bookings-page">
      <h1 className="page-title">My Bookings</h1>
      <button className="new-booking-btn" onClick={() => setOpenModal(true)}>
        New Booking
      </button>

      {bookings.length === 0 ? (
        <p className="no-bookings">No bookings found</p>
      ) : (
        <ul className="booking-list">
          {bookings.map((booking) => (
            <li key={booking._id} className="booking-item">
              <div className="booking-info">
                <p className="booking-details">
                  <span>{booking.date} @ {booking.time}</span> — <span>{booking.room}</span> with <span>{getDJName(booking.dj)}</span> <br />
                 
                </p>
                <div className="booking-actions">
                  <Link to={`/access-room/${booking._id}`}>
                    <button className="go-btn">Go to Room</button>
                  </Link>
                  <img
                    src={TrashIcon}
                    alt="Delete"
                    className="trash-icon"
                    onClick={() => deleteBooking(booking._id)}
                  />

                </div>
              </div>
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

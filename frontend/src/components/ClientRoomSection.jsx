import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/clientroom.css";

// Logos
import logo1 from "../assets/logos/logo1.png";
import logo2 from "../assets/logos/logo2.png";
import logo3 from "../assets/logos/logo3.png";
import logo4 from "../assets/logos/logo4.png";

// Room Images
import technoImg from "../assets/imgs/techno.png";
import commercialImg from "../assets/imgs/commercial.png";
import houseImg from "../assets/imgs/house.png";
import rnbImg from "../assets/imgs/rnb.png";

const rooms = [
  { name: "Techno Music", image: technoImg },
  { name: "Commercial Music", image: commercialImg },
  { name: "House Music", image: houseImg },
  { name: "R&B Music", image: rnbImg },
];

const logos = [logo1, logo2, logo3, logo4];

const ClientRoomSection = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigate = useNavigate();

  const handleRoomSelect = (roomName) => {
    setSelectedRoom(roomName);
  };

  const handleBooking = () => {
    if (selectedRoom) {
      navigate("/book");
    }
  };

  return (
    <section className="client-room-section">
      <div className="client-slideshow-section">
        {/* Clients Title */}
        <h2 className="client-logos-title">Our Clients</h2>
        {/* Logos Carousel */}
        <div className="client-logos-carousel">
          <div className="client-logos-track">
            {logos.concat(logos).map((logo, index) => (
              <img key={index} src={logo} alt={`client-${index}`} className="client-logo" />
            ))}
          </div>
        </div>
      </div>

      <div className="room-book-section">
        {/* Room Selection Title */}
        <h2 className="client-room-title">
          <span className="highlight">Select</span> & <span className="highlight">Book</span> Your Room
        </h2>
        {/* Rooms */}
        <div className="client-room-list">
          {rooms.map((room, index) => (
            <div
              key={index}
              className={`client-room-card ${selectedRoom === room.name ? "selected" : ""}`}
            >
              <img
                src={room.image}
                alt={room.name}
                className="client-room-image"
                onClick={() => handleRoomSelect(room.name)}
              />
              <h3 className="client-room-name">{room.name}</h3>
            </div>
          ))}
        </div>
        {/* Book Button */}
        <div className="client-room-footer">
          {!selectedRoom && <p className="room-warning">Please select a room</p>}
          <button
            className={`book-room-btn ${selectedRoom ? "active" : "disabled"}`}
            onClick={handleBooking}
            disabled={!selectedRoom}
          >
            Book
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClientRoomSection;

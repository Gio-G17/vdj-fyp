import React from "react";
import { useParams } from "react-router-dom";

const StreamRoomPage = () => {
  const { bookingId } = useParams();

  return (
    <div className="stream-room-page" style={{ color: "white", padding: "40px", textAlign: "center" }}>
      <h1>🎥 Welcome to Your Stream Room</h1>
      <p>You’ve entered the room for booking ID:</p>
      <code>{bookingId}</code>
      <p>Video call setup coming soon...</p>
    </div>
  );
};

export default StreamRoomPage;

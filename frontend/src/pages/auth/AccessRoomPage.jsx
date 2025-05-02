// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// const AccessRoomPage = () => {
//   const { bookingId } = useParams();
//   const navigate = useNavigate();

//   const [otp, setOtp] = useState("");
//   const [message, setMessage] = useState("");
//   const [resendMessage, setResendMessage] = useState("");

//   const token = localStorage.getItem("token");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         "http://localhost:5001/api/otp/verify-stream",
//         { bookingId, otp },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (res.data.message === "OTP verified") {
//         navigate(`/stream-room/${bookingId}`);
//       } else {
//         setMessage("Invalid OTP. Please try again.");
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.error || "Verification failed");
//     }
//   };

//   const handleResend = async () => {
//     try {
//       await axios.post(
//         "http://localhost:5001/api/otp/generate-stream",
//         { bookingId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       setResendMessage("✅ OTP resent to your email");
//     } catch (err) {
//       setResendMessage("❌ Failed to resend OTP");
//     }
//   };

//   return (
//     <div className="access-room-container">
//       <h2>Enter Your OTP to Join the Room</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Enter OTP"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           required
//         />
//         <button type="submit">Verify & Join</button>
//         <button type="button" onClick={handleResend} style={{ marginLeft: "10px" }}>
//           Resend OTP
//         </button>
//       </form>

//       {message && <p>{message}</p>}
//       {resendMessage && <p>{resendMessage}</p>}
//     </div>
//   );
// };

// export default AccessRoomPage;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AccessRoomPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("🔎 Logged in user role:", res.data?.role); // ✅ LOG USER ROLE        
        
        if (res.data?.role === "dj") {
          // ✅ Bypass OTP if DJ
          navigate(`/stream-room/${bookingId}`);
        }
      } catch (err) {
        console.error("Failed to get user:", err);
      }
    };

    checkUserRole();
  }, [bookingId, navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5001/api/otp/verify-stream",
        { bookingId, otp },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.message === "OTP verified") {
        navigate(`/stream-room/${bookingId}`);
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(
        "http://localhost:5001/api/otp/generate-stream",
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setResendMessage("✅ OTP resent to your email");
    } catch (err) {
      setResendMessage("❌ Failed to resend OTP");
    }
  };

  return (
    <div className="access-room-container">
      <h2>Enter Your OTP to Join the Room</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify & Join</button>
        <button type="button" onClick={handleResend} style={{ marginLeft: "10px" }}>
          Resend OTP
        </button>
      </form>

      {message && <p>{message}</p>}
      {resendMessage && <p>{resendMessage}</p>}
    </div>
  );
};

export default AccessRoomPage;

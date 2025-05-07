// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import io from "socket.io-client";
// import Peer from "simple-peer";

// const socket = io.connect("http://localhost:5001");

// const StreamRoomPage = () => {
//   const { bookingId } = useParams();
//   const myVideo = useRef();
//   const userVideo = useRef();
//   const [stream, setStream] = useState(null);
//   const [me, setMe] = useState("");
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [callEnded, setCallEnded] = useState(false);
//   const [receivingCall, setReceivingCall] = useState(false);
//   const [caller, setCaller] = useState("");
//   const [callerSignal, setCallerSignal] = useState(null);
//   const [name, setName] = useState("");
//   const [idToCall, setIdToCall] = useState("");
//   const connectionRef = useRef();

//   useEffect(() => {
//     console.log("🔄 Initializing media stream...");
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
//       setStream(currentStream);
//       if (myVideo.current) {
//         myVideo.current.srcObject = currentStream;
//         console.log("📹 My video stream set.");
//       }
//     });

//     socket.on("me", (id) => {
//       console.log("🆔 My socket ID:", id);
//       setMe(id);
//     });

//     socket.on("callUser", (data) => {
//       console.log("📞 Incoming call from:", data.from);
//       setReceivingCall(true);
//       setCaller(data.from);
//       setName(data.name);
//       setCallerSignal(data.signal);
//     });
//   }, []);

//   const callUser = (id) => {
//     console.log("📤 Calling user:", id);
//     const peer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream: stream,
//     });

//     peer.on("signal", (data) => {
//       console.log("📡 Sending signal...");
//       socket.emit("callUser", {
//         userToCall: id,
//         signalData: data,
//         from: me,
//         name,
//       });
//     });

//     peer.on("stream", (remoteStream) => {
//       console.log("🎥 Received remote stream.");
//       if (userVideo.current) {
//         userVideo.current.srcObject = remoteStream;
//       }
//     });

//     socket.on("callAccepted", (signal) => {
//       console.log("✅ Call accepted.");
//       setCallAccepted(true);
//       peer.signal(signal);
//     });

//     connectionRef.current = peer;
//   };

//   const answerCall = () => {
//     console.log("📥 Answering call from:", caller);
//     setCallAccepted(true);
//     const peer = new Peer({
//       initiator: false,
//       trickle: false,
//       stream: stream,
//     });

//     peer.on("signal", (data) => {
//       console.log("📡 Sending answer signal.");
//       socket.emit("answerCall", { signal: data, to: caller });
//     });

//     peer.on("stream", (remoteStream) => {
//       console.log("🎥 Received remote stream (answer).");
//       if (userVideo.current) {
//         userVideo.current.srcObject = remoteStream;
//       }
//     });

//     peer.signal(callerSignal);
//     connectionRef.current = peer;
//   };

//   const leaveCall = () => {
//     console.log("📴 Ending call.");
//     setCallEnded(true);
//     connectionRef.current.destroy();
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "20px", color: "white" }}>
//       <h2>Stream Room</h2>

//       <div style={{ display: "flex", gap: "20px" }}>
//         <div>
//           <h3>You</h3>
//           <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
//         </div>
//         <div>
//           <h3>Peer</h3>
//           <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
//         </div>
//       </div>

//       <input
//         placeholder="ID to call"
//         value={idToCall}
//         onChange={(e) => setIdToCall(e.target.value)}
//         style={{ marginTop: "20px", padding: "10px" }}
//       />
//       <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//         <button onClick={() => callUser(idToCall)}>Call</button>
//         <button onClick={answerCall}>Answer</button>
//         <button onClick={leaveCall}>End Call</button>
//       </div>
//     </div>
//   );
// };

// export default StreamRoomPage;
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";
import axios from "axios";

const socket = io("http://localhost:5001");

const StreamRoomPage = () => {
  const { bookingId } = useParams();
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [caller, setCaller] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);

  const [streamReady, setStreamReady] = useState(false);
  const [socketReady, setSocketReady] = useState(false);

  // Get user media
  useEffect(() => {
    console.log("🎥 Requesting media devices...");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      console.log("✅ Media stream acquired.");
      setStream(currentStream);
      setStreamReady(true);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }
    }).catch((err) => {
      console.error("❌ Failed to get media stream:", err);
    });
  }, []);

  // Register socket and listen for incoming calls
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    socket.emit("register-user", token);
    console.log("📡 Sent register-user event.");

    socket.on("me", (id) => {
      console.log("🆔 Received my socket ID:", id);
      setMe(id);
      setSocketReady(true);
    });

    socket.on("callUser", (data) => {
      if (alreadyAnswered) {
        console.warn("⛔ Already answered a call. Ignoring...");
        return;
      }

      console.log("📞 Incoming call from:", data.from);
      setCaller(data.from);
      setCallerSignal(data.signal);

      const tryAnswer = (attempts = 0) => {
        if (stream) {
          console.log("✅ Stream ready. Answering call.");
          setAlreadyAnswered(true);
          answerCall(data.signal, data.from);
        } else if (attempts < 10) {
          console.log("⏳ Waiting for stream to answer call...");
          setTimeout(() => tryAnswer(attempts + 1), 500);
        } else {
          console.error("❌ Timed out waiting for stream to answer.");
        }
      };

      tryAnswer();
    });

    socket.on("callAccepted", (signal) => {
      console.log("✅ Call accepted signal received.");
      setCallAccepted(true);
      connectionRef.current?.signal(signal);
    });

    return () => {
      socket.off("me");
      socket.off("callUser");
      socket.off("callAccepted");
    };
  }, [stream]);

  // Wait for stream + socket then trigger call attempt
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !streamReady || !socketReady) return;

    (async () => {
      try {
        console.log("📤 Registering socket ID on backend...");
        await axios.post("http://localhost:5001/api/users/socket/register", {
          socketId: me,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Socket ID registered on backend.");

        console.log("📥 Fetching my bookings...");
        const res = await axios.get("http://localhost:5001/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const booking = res.data.find((b) => b._id === bookingId);
        if (!booking) {
          console.warn("⚠️ Booking not found.");
          return;
        }

        const myPayload = JSON.parse(atob(token.split(".")[1]));
        const myUserId = myPayload.userId || myPayload.id;
        const peerUserId = myUserId === booking.user ? booking.dj : booking.user;

        console.log("👥 My userId:", myUserId, "| Peer userId:", peerUserId);

        const fetchPeerSocketId = async (attempt = 0) => {
          try {
            const peerSocket = await axios.get(`http://localhost:5001/api/users/socket-id/${peerUserId}`);
            const peerSocketId = peerSocket.data.socketId;
            console.log("📞 Retrieved peer socket ID:", peerSocketId);
            callUser(peerSocketId);
          } catch (err) {
            if (attempt < 10) {
              console.warn(`⏳ Peer socket not found (attempt ${attempt + 1}). Retrying...`);
              setTimeout(() => fetchPeerSocketId(attempt + 1), 1000);
            } else {
              console.error("❌ Gave up waiting for peer to register socket.");
            }
          }
        };

        fetchPeerSocketId();
      } catch (err) {
        console.error("❌ Error during setup:", err);
      }
    })();
  }, [streamReady, socketReady, bookingId]);

  const callUser = (id) => {
    console.log("📞 Calling peer:", id);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      console.log("📡 Emitting signal to peer...");
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: "",
      });
    });

    peer.on("stream", (remoteStream) => {
      console.log("📺 Received remote stream from peer.");
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.on("error", (err) => {
      console.error("❌ Peer connection error:", err);
    });

    connectionRef.current = peer;
  };

  const answerCall = (signal, from) => {
    console.log("📥 Answering call from:", from);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      console.log("📡 Sending answer signal to caller...");
      socket.emit("answerCall", { signal: data, to: from });
    });

    peer.on("stream", (remoteStream) => {
      console.log("📺 Received remote stream after answering.");
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.on("error", (err) => {
      console.error("❌ Peer connection error during answer:", err);
    });

    peer.signal(signal);
    connectionRef.current = peer;
    setCallAccepted(true);
  };

  const leaveCall = () => {
    console.log("📴 Leaving and destroying peer connection...");
    connectionRef.current?.destroy();
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "20px", color: "white" }}>
      <h2>Stream Room</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h3>You</h3>
          <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
        </div>
        <div>
          <h3>Peer</h3>
          <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
        </div>
      </div>
      <button onClick={leaveCall} style={{ marginTop: "20px" }}>End Call</button>
    </div>
  );
};

export default StreamRoomPage;

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io.connect("http://localhost:5001");

const StreamRoomPage = () => {
  const { bookingId } = useParams();
  const myVideo = useRef();
  const userVideo = useRef();
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [name, setName] = useState("");
  const [idToCall, setIdToCall] = useState("");
  const connectionRef = useRef();

  useEffect(() => {
    console.log("🔄 Initializing media stream...");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
        console.log("📹 My video stream set.");
      }
    });

    socket.on("me", (id) => {
      console.log("🆔 My socket ID:", id);
      setMe(id);
    });

    socket.on("callUser", (data) => {
      console.log("📞 Incoming call from:", data.from);
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    console.log("📤 Calling user:", id);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      console.log("📡 Sending signal...");
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (remoteStream) => {
      console.log("🎥 Received remote stream.");
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    socket.on("callAccepted", (signal) => {
      console.log("✅ Call accepted.");
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    console.log("📥 Answering call from:", caller);
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      console.log("📡 Sending answer signal.");
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (remoteStream) => {
      console.log("🎥 Received remote stream (answer).");
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    console.log("📴 Ending call.");
    setCallEnded(true);
    connectionRef.current.destroy();
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

      <input
        placeholder="ID to call"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
        style={{ marginTop: "20px", padding: "10px" }}
      />
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button onClick={() => callUser(idToCall)}>Call</button>
        <button onClick={answerCall}>Answer</button>
        <button onClick={leaveCall}>End Call</button>
      </div>
    </div>
  );
};

export default StreamRoomPage;

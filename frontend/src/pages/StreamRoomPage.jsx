import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Peer from "peerjs";

const socket = io("http://localhost:5001");

const StreamRoomPage = () => {
  const { bookingId } = useParams();
  const myVideo = useRef();
  const videoGrid = useRef();
  const myPeer = useRef();
  const peers = useRef({});

  useEffect(() => {
    myPeer.current = new Peer(undefined, {
      host: "/",
      port: "5001",
      path: "/peerjs/myapp",
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        myVideo.current.srcObject = stream;
        myVideo.current.addEventListener("loadedmetadata", () => {
          myVideo.current.play();
        });
        videoGrid.current.append(myVideo.current);

        myPeer.current.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            video.srcObject = userVideoStream;
            video.addEventListener("loadedmetadata", () => {
              video.play();
            });
            videoGrid.current.append(video);
          });
        });

        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    socket.emit("join-room", bookingId, myPeer.current.id);

    socket.on("user-disconnected", (userId) => {
      if (peers.current[userId]) peers.current[userId].close();
    });

    const connectToNewUser = (userId, stream) => {
      const call = myPeer.current.call(userId, stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        video.srcObject = userVideoStream;
        video.addEventListener("loadedmetadata", () => {
          video.play();
        });
        videoGrid.current.append(video);
      });
      call.on("close", () => {
        video.remove();
      });

      peers.current[userId] = call;
    };
  }, [bookingId]);

  return (
    <div>
      <div ref={videoGrid}></div>
      <video ref={myVideo} muted playsInline></video>
    </div>
  );
};

export default StreamRoomPage;

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { ExpressPeerServer } = require("peer");

require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const contactRoutes = require("./routes/contactRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const streamOtpRoutes = require("./routes/streamOtpRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "http://localhost:5173", // ✅ Use your frontend address
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

// ✅ WebSocket server (Socket.IO)
const io = new Server(server, { cors: corsOptions });

// ✅ PeerJS server
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/peerjs",
});
app.use("/peerjs", peerServer);

const PORT = process.env.PORT || 5001;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors(corsOptions));
const userSocketMap = {};
global.userSocketMap = userSocketMap;
app.use(express.json());



// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/otp", streamOtpRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("Backend running..."));

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

// // ✅ Socket.IO Signaling
// io.on("connection", (socket) => {
//   console.log(`✅ Socket connected: ${socket.id}`);
//   socket.emit("me", socket.id);  // <-- ✅ ADD THIS LINE

//   socket.on("join-room", (roomId) => {
//     socket.join(roomId);
//     console.log(`👥 ${socket.id} joined room ${roomId}`);

//     const roomSockets = [...io.sockets.adapter.rooms.get(roomId) || []];
//     console.log(`👥 Room ${roomId} has ${roomSockets.length} members:`, roomSockets);

//     roomSockets.forEach((otherSocketId) => {
//       if (otherSocketId !== socket.id) {
//         socket.to(otherSocketId).emit("user-joined", socket.id);
//         socket.emit("user-joined", otherSocketId);
//       }
//     });
//   });

//   socket.on("signal", ({ to, signal }) => {
//     io.to(to).emit("signal", { from: socket.id, signal });
//   });

//   socket.on("disconnect", () => {
//     console.log(`❌ Socket disconnected: ${socket.id}`);
//   });
// });

// ✅ Start server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

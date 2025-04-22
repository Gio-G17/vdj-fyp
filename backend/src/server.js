const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { ExpressPeerServer } = require("peer");

require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const djRoutes = require("./routes/djRoutes");
const contactRoutes = require("./routes/contactRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const streamOtpRoutes = require("./routes/streamOtpRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "http://localhost:5173", // ✅ Use your frontend address
  methods: ["GET", "POST"],
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
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/djs", djRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/otp", streamOtpRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("Backend running..."));

// ✅ Socket.IO Signaling
io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`👥 ${socket.id} joined room ${roomId}`);

    const roomSockets = [...io.sockets.adapter.rooms.get(roomId) || []];
    console.log(`👥 Room ${roomId} has ${roomSockets.length} members:`, roomSockets);

    roomSockets.forEach((otherSocketId) => {
      if (otherSocketId !== socket.id) {
        socket.to(otherSocketId).emit("user-joined", socket.id);
        socket.emit("user-joined", otherSocketId);
      }
    });
  });

  socket.on("signal", ({ to, signal }) => {
    io.to(to).emit("signal", { from: socket.id, signal });
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// ✅ Start server
server.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { setIO } from "./utils/socket.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { autoIndex: true })
  .then(() => {
    mongoose.set("strictPopulate", false);
    console.log("MongoDB connected");
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Root test
app.get("/", (req, res) => {
  res.send("🌾 AgriConnect API is running...");
});

// Create HTTP server and attach Socket.io
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

setIO(io);

io.on('connection', (socket) => {
  // client should emit 'join' with userId to join their personal room
  socket.on('join', (userId) => {
    if (userId) socket.join(userId.toString());
  });
});

// Start server and handle port errors gracefully
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

httpServer.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please free the port or set a different PORT in your .env file.`);
    console.error('On Windows (PowerShell) you can run:');
    console.error(`  netstat -a -n -o | findstr :${PORT}`);
    console.error('Then kill the process using the PID shown:');
    console.error('  taskkill /PID <PID> /F');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

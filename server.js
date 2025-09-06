import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import fs from "fs";

import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/users.js";
import messageRoutes from "./src/routes/messages.js";
import mediaRoutes from "./src/routes/media.js";
import initSockets from "./src/sockets/index.js";
import connectDB from "./src/config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use(
  express.json({
    limit: "20mb",
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/media", mediaRoutes);

// Connect Database
(async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }

  // Create HTTP server from Express app
  const httpServer = http.createServer(app);

  // Create Socket.IO server attached to HTTP server
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Initialize Socket.IO event handlers
  initSockets(io);

  // Start the HTTP server
  httpServer.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });
})();

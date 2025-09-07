import dotenv from "dotenv";
dotenv.config();
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

// ---------- CORS Configuration ----------
const allowedOrigins = [
  "http://localhost:5173", // local dev
  process.env.CLIENT_URL // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: This origin is not allowed"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(
  express.json({
    limit: "20mb",
  })
);

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// ---------- API Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/media", mediaRoutes);

// Root route to test backend deployment
app.get("/", (req, res) => {
  res.send("ChatSphere Backend is running 🚀");
});

// ---------- Connect Database and start server ----------
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
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("CORS policy: This origin is not allowed"));
        }
      },
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
    console.log(`🌐 Allowed frontend URL: ${process.env.CLIENT_URL}`);
  });
})();


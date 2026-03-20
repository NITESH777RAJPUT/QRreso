import "dotenv/config";

import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import app from "./app.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import { initSocket } from "./sockets/order.socket.js";

// ================= PATH FIX =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= DB =================
connectDB();

// ================= SERVER =================
const server = http.createServer(app);

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initSocket(io);

// ================= FRONTEND SERVE =================

// 👉 CUSTOMER (root)
app.use(express.static(path.join(__dirname, "../customer-dist")));

// 👉 ADMIN (/admin)
app.use("/admin", express.static(path.join(__dirname, "../restaurant-dist")));

// ================= FALLBACK ROUTES =================

// 👉 ADMIN fallback (React routing ONLY)
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../restaurant-dist", "index.html"));
});

// 👉 CUSTOMER fallback (React routing ONLY)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../customer-dist", "index.html"));
});

// ================= START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
import "dotenv/config";

import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import app from "./app.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import { initSocket } from "./sockets/order.socket.js";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const server = http.createServer(app);

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

initSocket(io);

// ================= FRONTEND SERVE =================

// 👉 CUSTOMER APP (QR scan yaha aayega)
app.use("/", express.static(path.join(__dirname, "../customer-dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../customer-dist", "index.html"));
});

// 👉 RESTAURANT / ADMIN APP
app.use("/admin", express.static(path.join(__dirname, "../restaurant-dist")));

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../restaurant-dist", "index.html"));
});

// ================= START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`🚀 Server running with Socket.io on port ${PORT}`)
);
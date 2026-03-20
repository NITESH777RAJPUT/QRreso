import express from "express";
import cors from "cors";

// Routes imports
import customerRoutes from "./routes/customer.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import authRoutes from "./routes/auth.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import qrRoutes from "./routes/qr.routes.js";
import tableRoutes from "./routes/table.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

// =======================
// 🔥 MIDDLEWARES
// =======================
import "dotenv/config";

import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import app from "./app.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import { initSocket } from "./sockets/order.socket.js";

// fix __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

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

// 👉 ADMIN fallback (React routing)
app.use("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../restaurant-dist", "index.html"));
});

// 👉 CUSTOMER fallback (React routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../customer-dist", "index.html"));
});

// ================= START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
// Better CORS setup (Production ready)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ❌ REMOVED uploads static folder (Cloudinary use ho raha hai)

// =======================
// 🔥 HEALTH CHECK
// =======================

app.get("/", (req, res) => {
  res.send("QR Restaurant Backend Running 🚀");
});

// =======================
// 🔥 API ROUTES
// =======================

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);

// =======================
// 🔥 404 HANDLER
// =======================

app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// =======================
// 🔥 GLOBAL ERROR HANDLER
// =======================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

export default app;
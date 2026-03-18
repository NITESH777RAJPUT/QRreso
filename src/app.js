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
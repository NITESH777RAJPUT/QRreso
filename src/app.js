import express from "express";
import cors from "cors";

// Routes
import customerRoutes from "./routes/customer.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import authRoutes from "./routes/auth.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import qrRoutes from "./routes/qr.routes.js";
import tableRoutes from "./routes/table.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);

// ================= ERROR =================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
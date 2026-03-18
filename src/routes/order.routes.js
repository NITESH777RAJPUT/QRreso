import express from "express";
import authRestaurant from "../middlewares/auth.middleware.js";
import {
  updateOrderStatus,
  getAdminAnalytics
} from "../controllers/order.controller.js";

const router = express.Router();

/* ===============================
   📊 Admin Analytics
   (STATIC route first)
=============================== */
router.get(
  "/analytics",
  authRestaurant,
  getAdminAnalytics
);

/* ===============================
   🔄 Update Order Status
   (Dynamic route below)
=============================== */
router.put(
  "/:orderId/status",
  authRestaurant,
  updateOrderStatus
);

export default router;
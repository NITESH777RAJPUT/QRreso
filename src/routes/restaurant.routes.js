import express from "express";
import {
  getOrders,
  updateOrderStatus
} from "../controllers/restaurant.controller.js";

const router = express.Router();

// Saare orders restaurant ke
router.get(
  "/orders/:restaurantId",
  getOrders
);

// Order status update
router.patch(
  "/order/:orderId/status",
  updateOrderStatus
);

export default router;
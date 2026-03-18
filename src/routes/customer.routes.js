import express from "express";
import {
  getMenu,
  createOrder
} from "../controllers/customer.controller.js";

const router = express.Router();

// QR scan ke baad menu
router.get(
  "/menu/:restaurantId",
  getMenu
);

// Payment success ke baad order create
router.post(
  "/order",
  createOrder
);

export default router;
import express from "express";
import authRestaurant from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  addMenuItem,
  getMyMenu,
  deleteMenuItem,
  updateMenuItem
} from "../controllers/menu.controller.js";

const router = express.Router();

// ➕ Add item
router.post(
  "/",
  authRestaurant,
  upload.single("image"),
  addMenuItem
);

// 📋 Get menu
router.get(
  "/",
  authRestaurant,
  getMyMenu
);

// ✏️ Update item
router.put(
  "/:id",
  authRestaurant,
  updateMenuItem
);

// 🗑️ Delete item
router.delete(
  "/:id",
  authRestaurant,
  deleteMenuItem
);

export default router;
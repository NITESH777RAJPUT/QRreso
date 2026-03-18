import express from "express";
import { generateQR } from "../controllers/qr.controller.js";
import authRestaurant from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:tableId", authRestaurant, generateQR);

export default router;
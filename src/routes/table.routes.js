import express from "express";
import authRestaurant from "../middlewares/auth.middleware.js";
import { addTable, getMyTables } from "../controllers/table.controller.js";

const router = express.Router();

router.post("/", authRestaurant, addTable);
router.get("/", authRestaurant, getMyTables);

export default router;
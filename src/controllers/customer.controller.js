import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";
import Table from "../models/Table.js";

export const getMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menu = await MenuItem.find({
      restaurantId,
      isAvailable: true
    });

    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: "Menu fetch failed" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      tableId,
      items,
      totalAmount
    } = req.body;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(400).json({ message: "Invalid table" });
    }

    const order = await Order.create({
      restaurantId,
      tableId,
      items,
      totalAmount,
      paymentStatus: "PAID"
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Order creation failed" });
  }
};
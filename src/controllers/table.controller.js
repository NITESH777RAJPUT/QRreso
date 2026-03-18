import Table from "../models/Table.js";

// ➕ Add new table
export const addTable = async (req, res) => {
  try {
    const table = await Table.create({
      restaurantId: req.restaurantId,
      tableNumber: req.body.tableNumber,
    });

    res.json(table);
  } catch (err) {
    res.status(500).json({ message: "Error adding table" });
  }
};

// 📋 Get my tables
export const getMyTables = async (req, res) => {
  try {
    const tables = await Table.find({
      restaurantId: req.restaurantId,
    });

    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tables" });
  }
};
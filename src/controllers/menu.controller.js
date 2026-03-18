import MenuItem from "../models/MenuItem.js";
import cloudinary from "../config/cloudinary.js";

// ➕ Add new menu item
export const addMenuItem = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: "Name and Price are required",
      });
    }

    let imageUrl = null;

    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "restaurant-menu",
      });

      imageUrl = result.secure_url;
    }

    const item = await MenuItem.create({
      restaurantId: req.restaurantId,
      name: name.trim(),
      price: Number(price),
      image: imageUrl,
      isAvailable: true,
    });

    res.json(item);
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({
      message: "Error adding item",
      error: err.message,
    });
  }
};

// 📋 Get logged-in restaurant menu
export const getMyMenu = async (req, res) => {
  try {
    const menu = await MenuItem.find({
      restaurantId: req.restaurantId,
    });

    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching menu" });
  }
};

// 🗑️ Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete image from Cloudinary
    if (item.image) {
      const publicId = item.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`restaurant-menu/${publicId}`);
    }

    await item.deleteOne();

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting item" });
  }
};

// ✏️ Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { name, price } = req.body;

    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.name = name ? name.trim() : item.name;
    item.price = price ? Number(price) : item.price;

    await item.save();

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating item" });
  }
};
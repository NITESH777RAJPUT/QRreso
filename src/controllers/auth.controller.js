import Restaurant from "../models/Restaurant.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ========================
// 🔥 SIGNUP
// ========================

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingRestaurant = await Restaurant.findOne({
      email: email.toLowerCase()
    });

    if (existingRestaurant) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const restaurant = await Restaurant.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    res.status(201).json({
      message: "Signup successful",
      restaurantId: restaurant._id
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ========================
// 🔥 LOGIN
// ========================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const restaurant = await Restaurant.findOne({
      email: email.toLowerCase()
    });

    if (!restaurant) {
      return res.status(400).json({
        message: "Account not found. Please signup."
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      restaurant.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong password"
      });
    }

    const token = jwt.sign(
      { id: restaurant._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      restaurantId: restaurant._id
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
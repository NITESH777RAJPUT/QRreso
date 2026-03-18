import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    subscriptionStatus: {
      type: String,
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
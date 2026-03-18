import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    tableId: String,
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: Number,
    paymentStatus: {
      type: String,
      default: "PAID",
    },
    orderStatus: {
      type: String,
      default: "NEW",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
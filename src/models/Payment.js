import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },

  razorpayOrderId: String,
  razorpayPaymentId: String,

  amount: Number,

  status: {
    type: String,
    enum: ["SUCCESS", "FAILED"],
    default: "SUCCESS"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Payment", paymentSchema);
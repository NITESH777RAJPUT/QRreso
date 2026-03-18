import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  plan: {
    type: String,
    enum: ["MONTHLY", "YEARLY"]
  },

  amount: Number,

  startDate: Date,
  endDate: Date,

  status: {
    type: String,
    enum: ["ACTIVE", "EXPIRED"],
    default: "ACTIVE"
  }
});

export default mongoose.model("Subscription", subscriptionSchema);
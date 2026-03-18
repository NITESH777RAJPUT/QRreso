import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  tableNumber: String,
});

export default mongoose.model("Table", tableSchema);
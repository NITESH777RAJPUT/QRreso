import Order from "../models/Order.js";
import { emitOrderStatus } from "../sockets/order.socket.js";

export const getOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const orders = await Order.find({ restaurantId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Orders fetch failed" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    // 🔥 Emit status update to customer
    emitOrderStatus(order.restaurantId.toString(), order);

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
};
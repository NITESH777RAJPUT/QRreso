import Order from "../models/Order.js";
import { emitOrderUpdate } from "../sockets/order.socket.js";

/* =========================================
   🔄 Update Order Status
========================================= */

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    // Emit real-time update
    emitOrderUpdate(order.restaurantId.toString(), order);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Status update failed" });
  }
};


/* =========================================
   📊 Admin Analytics
========================================= */

export const getAdminAnalytics = async (req, res) => {
  try {
    const restaurantId = req.restaurantId;

    const orders = await Order.find({ restaurantId });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const pendingOrders = orders.filter(
      (order) => order.orderStatus !== "SERVED"
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(
      (order) => new Date(order.createdAt) >= today
    ).length;

    // 🔥 Top selling item
    const itemCount = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemCount[item.name]) {
          itemCount[item.name] = 0;
        }
        itemCount[item.name] += item.quantity;
      });
    });

    const topItem = Object.entries(itemCount).sort(
      (a, b) => b[1] - a[1]
    )[0];

    // 📊 Monthly Revenue Breakdown
    const monthlyRevenue = {};

    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = 0;
      }

      monthlyRevenue[month] += order.totalAmount;
    });

    const revenueChart = Object.entries(monthlyRevenue).map(
      ([month, revenue]) => ({
        month,
        revenue,
      })
    );

    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      todayOrders,
      topSellingItem: topItem ? topItem[0] : null,
      revenueChart, // 🔥 THIS WAS MISSING
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytics error" });
  }
};
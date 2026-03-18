import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import { emitNewOrder } from "../sockets/order.socket.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= CREATE RAZORPAY ORDER =================
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json(razorpayOrder);
  } catch (err) {
    console.error("Create Payment Error:", err);
    res.status(500).json({ message: "Payment order creation failed" });
  }
};

// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderData
    ) {
      return res.status(400).json({ message: "Missing payment data" });
    }

    // 🔐 Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // ================= CREATE ORDER =================
    const order = await Order.create({
      restaurantId: orderData.restaurantId,
      tableId: orderData.tableId,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      paymentStatus: "PAID",
      orderStatus: "NEW",
    });

    // ================= SAVE PAYMENT =================
    await Payment.create({
      orderId: order._id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount: orderData.totalAmount,
      status: "SUCCESS",
    });

    // ================= EMIT LIVE ORDER =================
    emitNewOrder(order.restaurantId.toString(), order);

    res.json({
      success: true,
      message: "Payment verified & order created",
      order,
    });
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
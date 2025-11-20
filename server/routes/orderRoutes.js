// server/routes/orderRoutes.js

import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getIO } from "../utils/socket.js";

const router = express.Router();

// CREATE ORDER
router.post("/", protect, authorize("buyer"), async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!product.farmerId) return res.status(400).json({ message: "Product has no farmer" });
    if (product.quantity < quantity) return res.status(400).json({ message: "Not enough stock" });

    const totalPrice = product.pricePerKg * quantity;

    const order = await Order.create({
      buyerId: req.user._id,
      farmerId: product.farmerId,
      productId,
      quantity,
      totalPrice,
      status: "pending",
    });

    product.quantity -= quantity;
    await product.save();

    // Notify farmer — YOUR Notification model uses userId, not user
    const notif = await Notification.create({
      userId: product.farmerId,   // ← FIXED
      message: `New order: ${quantity}kg of ${product.name} from ${req.user.name}`,
      type: "new_order",
      orderId: order._id,
    });

    getIO().to(product.farmerId.toString()).emit("newNotification", {
      _id: notif._id,
      message: notif.message,
      createdAt: notif.createdAt,
      read: false,
    });

    res.status(201).json({ order, message: "Order placed successfully!" });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE STATUS
router.put("/:id/status", protect, authorize("farmer"), async (req, res) => {
  try {
    const { status } = req.body;
    const validTransitions = { pending: ["accepted", "rejected"], accepted: ["shipped"], shipped: ["delivered"] };

    const order = await Order.findById(req.params.id)
      .populate("buyerId", "name")
      .populate("productId", "name");

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.farmerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not your order" });
    if (!validTransitions[order.status]?.includes(status)) return res.status(400).json({ message: "Invalid status" });

    order.status = status;
    await order.save();

    const messages = {
      accepted: `Your order for ${order.quantity}kg of ${order.productId.name} has been ACCEPTED!`,
      rejected: `Your order was REJECTED.`,
      shipped: `Your order has been SHIPPED!`,
      delivered: `Your order has been DELIVERED!`,
    };

    if (messages[status]) {
      const notif = await Notification.create({
        userId: order.buyerId._id,   // ← FIXED
        message: messages[status],
        type: "order_status",
        orderId: order._id,
        read: false,
      });

      getIO().to(order.buyerId._id.toString()).emit("orderStatusUpdated", {
        notification: { _id: notif._id, message: notif.message, createdAt: notif.createdAt, read: false },
        orderId: order._id,
        newStatus: status,
      });
    }

    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET & DELETE routes stay the same (already correct with buyerId/farmerId)
router.get("/", protect, async (req, res) => {
  try {
    const query = req.user.role === "buyer" ? { buyerId: req.user._id } : { farmerId: req.user._id };
    const orders = await Order.find(query)
      .populate("productId", "name image pricePerKg")
      .populate(req.user.role === "buyer" ? "farmerId" : "buyerId", "name phone")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

router.delete("/:id", protect, authorize("buyer"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.buyerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });
    if (order.status !== "pending") return res.status(400).json({ message: "Only pending orders can be cancelled" });

    const product = await Product.findById(order.productId);
    if (product) { product.quantity += order.quantity; await product.save(); }

    await Order.deleteOne({ _id: order._id });
    res.json({ message: "Order cancelled" });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

export default router;
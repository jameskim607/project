import Order from "../models/order.js";
import Product from "../models/product.js";
import Notification from "../models/notification.js";
import { getIO } from "../utils/socket.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Buyer)
export const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Calculate total price
    const totalPrice = quantity * product.pricePerKg;

    const newOrder = await Order.create({
      buyerId: req.user._id,
      productId,
      quantity,
      totalPrice
    });

    // Create notification for the farmer who owns the product
    try {
      const farmerId = product.farmerId;
      if (farmerId) {
        const notif = await Notification.create({
          userId: farmerId,
          message: `New order placed for ${product.name} (${quantity} kg)`,
          relatedOrderId: newOrder._id
        });

        // Emit real-time notification via Socket.io to farmer room
        const io = getIO();
        if (io) {
          io.to(farmerId.toString()).emit('newNotification', notif);
        }
      }
    } catch (notifErr) {
      console.error("Failed to create notification:", notifErr.message);
    }

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders for logged-in user
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === "buyer") {
      orders = await Order.find({ buyerId: req.user._id }).populate("productId");
    } else if (req.user.role === "farmer") {
      // Get orders for products the farmer owns
      const products = await Product.find({ farmerId: req.user._id });
      const productIds = products.map((p) => p._id);
      orders = await Order.find({ productId: { $in: productIds } }).populate("buyerId productId");
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Farmer only)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("productId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only the farmer who owns the product can update
    if (order.productId.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = req.body.status || order.status;
    await order.save();

    // create notification for buyer
    try {
      const buyerId = order.buyerId;
      const notif = await Notification.create({
        userId: buyerId,
        message: `Order ${order._id} status updated to ${order.status}`,
        relatedOrderId: order._id
      });
      const io = getIO();
      if (io) {
        io.to(buyerId.toString()).emit('orderStatusUpdated', { order: order._id, status: order.status, notification: notif });
      }
    } catch (err) {
      console.error('Failed to notify buyer about status update', err.message);
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Buyer only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only the buyer who placed the order can delete
    if (order.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this order" });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

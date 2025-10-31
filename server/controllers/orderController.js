import Order from "../models/order.js";
import Product from "../models/product.js";

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

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

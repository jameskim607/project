import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "shipped", "delivered"],
    default: "pending"
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);

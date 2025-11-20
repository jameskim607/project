// models/Product.js
import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  pricePerKg: {
    type: Number,
    required: true,
  },
  quantityAvailable: {           // ← THIS IS WHAT YOUR FORM SENDS
    type: Number,
    required: true,
    default: 0,
  },
  image: {
    type: String,
    default: "/uploads/default.jpg",
  },
  views: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
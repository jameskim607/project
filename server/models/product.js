import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  pricePerKg: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  available: { type: Boolean, default: true },
  dateListed: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);

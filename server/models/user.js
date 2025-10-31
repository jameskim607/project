import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["farmer", "buyer", "admin"], default: "farmer" },
  location: { type: String },
  verified: { type: Boolean, default: false },
  dateJoined: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model("User", userSchema);

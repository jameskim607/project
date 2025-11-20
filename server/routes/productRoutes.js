// routes/productRoutes.js   ← FINAL 100% WORKING
import express from "express";
import multer from "multer";
import path from "path";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  incrementView,
  addReview,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// MULTER SETUP
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "-"));
  },
});

const upload = multer({ storage });

// PUBLIC ROUTES
router.get("/", getProducts);
router.get("/:id", getProduct);

// PROTECTED ROUTES
router.post("/:id/view", protect, incrementView);
router.post("/:id/reviews", protect, addReview);

// FARMER ONLY ROUTES
router.post("/", protect, authorize("farmer"), upload.single("image"), createProduct);
router.put("/:id", protect, authorize("farmer"), upload.single("image"), updateProduct);
router.delete("/:id", protect, authorize("farmer"), deleteProduct);

// Get farmer's products
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const Product = (await import("../models/Product.js")).default;
    const products = await Product.find({ farmerId: req.params.farmerId }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
import express from "express";
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Protected routes (Farmer only)
router.post("/", protect, authorizeRoles("farmer"), createProduct);
router.put("/:id", protect, authorizeRoles("farmer"), updateProduct);
router.delete("/:id", protect, authorizeRoles("farmer"), deleteProduct);

export default router;

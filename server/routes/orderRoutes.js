import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

// Place a new order (Buyer only)
router.post("/", protect, authorizeRoles("buyer"), createOrder);

// Get orders
router.get("/", protect, getOrders);

// Update order status
router.put("/:id", protect, authorizeRoles("farmer"), updateOrderStatus);

export default router;

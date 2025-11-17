import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { createOrder, getOrders, updateOrderStatus, deleteOrder } from "../controllers/orderController.js";

const router = express.Router();

// Place a new order (Buyer only)
router.post("/", protect, authorizeRoles("buyer"), createOrder);

// Get orders
router.get("/", protect, getOrders);

// Update order status
router.put("/:id", protect, authorizeRoles("farmer"), updateOrderStatus);

// Delete order
router.delete("/:id", protect, deleteOrder);

export default router;

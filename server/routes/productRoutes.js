import express from "express";
import multer from "multer";
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct, incrementView, addReview } from "../controllers/productController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Setup multer for uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "-"));
	}
});
const upload = multer({ storage });

// Public routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Increment view count
router.post("/:id/view", protect, incrementView);

// Add review
router.post("/:id/reviews", protect, addReview);

// Protected routes (Farmer only) - support image upload field named 'image'
router.post("/", protect, authorizeRoles("farmer"), upload.single("image"), createProduct);
router.put("/:id", protect, authorizeRoles("farmer"), upload.single("image"), updateProduct);
router.delete("/:id", protect, authorizeRoles("farmer"), deleteProduct);

export default router;

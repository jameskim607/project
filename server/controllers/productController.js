import Product from "../models/product.js";
import fs from "fs";

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Farmer)
const createProduct = async (req, res) => {
  try {
    // Support multipart/form-data (file upload) or JSON body
    const { name, description, category, pricePerKg, quantity } = req.body;

    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newProduct = await Product.create({
      name,
      description,
      category,
      pricePerKg,
      quantity,
      imageUrl,
      farmerId: req.user._id
    });

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("farmerId", "name email location");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("farmerId", "name email location");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment view count for a product
const incrementView = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.views = (product.views || 0) + 1;
    await product.save();
    res.json({ message: "View incremented", views: product.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add review to product
const addReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { rating, comment } = req.body;
    const review = {
      reviewerId: req.user._id,
      name: req.user.name,
      rating: Number(rating) || 0,
      comment,
      date: new Date()
    };

    product.reviews = product.reviews || [];
    product.reviews.push(review);
    // Recalculate average rating
    product.averageRating = (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length) || 0;
    await product.save();

    res.json({ message: "Review added", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Farmer only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ensure the logged-in farmer owns this product
    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Farmer only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ensure the logged-in farmer owns this product
    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    // Use deleteOne() instead of remove()
    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: error.message });
  }
};

export {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  incrementView,
  addReview
};

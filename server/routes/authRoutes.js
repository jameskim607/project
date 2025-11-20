import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import User from "../models/user.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name phone location role");
    if (!user) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

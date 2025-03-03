import express from "express";
import { getReviews, addReview, deleteReview } from "../controllers/reviewController.js"; // Import controllers
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getReviews);
router.post("/update", isAuthenticated, addReview);
router.delete("/delete/:id", isAuthenticated, deleteReview);

export default router; // Use `export default` instead of `module.exports`

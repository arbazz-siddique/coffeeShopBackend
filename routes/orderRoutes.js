import express from "express";
import { getOrders, placeOrder, updateOrderStatus, deleteOrder } from "../controllers/orderController.js"; // Import controllers
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/get", isAuthenticated, getOrders);
router.post("/placeorder", isAuthenticated, placeOrder);
router.put("/update/:id", isAuthenticated, updateOrderStatus);
router.delete("/delete/:id", isAuthenticated, deleteOrder);

export default router; // Use `export default` instead of `module.exports`

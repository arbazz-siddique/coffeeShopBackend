import express from "express";
import {register, login, getUser, logout} from "../controllers/authController.js"
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me",isAuthenticated, getUser);

export default router;
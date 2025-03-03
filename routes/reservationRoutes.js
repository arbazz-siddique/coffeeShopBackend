import express from "express";
import { getReservations, makeReservation, updateReservationStatus, deleteReservation } from "../controllers/reservationController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, getReservations);
router.post("/make", isAuthenticated, makeReservation);
router.put("/update/:id", isAuthenticated, updateReservationStatus);
router.delete("/delete/:id", isAuthenticated, deleteReservation);

export default router;
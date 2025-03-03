import Reservation from "../models/Reservation.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";

export const getReservations = catchAsyncErrors(async (req, res) => {
  const reservations = await Reservation.find().populate("user");
  res.status(200).json({
    success: true,
    reservations,
  });
});

export const makeReservation = catchAsyncErrors(async (req, res, next) => {
  const { date, time, numberOfPeople } = req.body;

  if (!date || !time || !numberOfPeople) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const reservation = await Reservation.create({
    user: req.user.id,
    date,
    time,
    numberOfPeople,
  });

  res.status(201).json({
    success: true,
    message: "Reservation created successfully!",
    reservation,
  });
});

export const updateReservationStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  // console.log("Received Status:", status);  

  const reservation = await Reservation.findById(id);
  if (!reservation) {
    return next(new ErrorHandler("Reservation not found!", 404));
  }

  reservation.status = status;
  await reservation.save();

  res.status(200).json({
    success: true,
    message: "Reservation status updated!",
    reservation,
  });
});

export const deleteReservation = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  const reservation = await Reservation.findById(id);
  if (!reservation) {
    return next(new ErrorHandler("reservation not found!", 404));
  }

  await reservation.deleteOne();

  res.status(200).json({
    success: true,
    message: "reservation deleted successfully!",
  });
});
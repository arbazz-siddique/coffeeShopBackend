// controllers/reviewController.js
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import Review from "../models/Review.js";

// ✅ Get All Reviews
export const getReviews = catchAsyncErrors(async (req, res) => {
  const reviews = await Review.find().populate("user menuItem");
  res.status(200).json({
    success: true,
    reviews,
  });
});

// ✅ Add a New Review
export const addReview = catchAsyncErrors(async (req, res, next) => {
  const { menuItemId, rating, comment } = req.body;

  if (!menuItemId || !rating || !comment) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  const review = await Review.create({
    user: req.user.id,
    menuItem: menuItemId,
    rating,
    comment,
  });
  const populatedReview = await review.populate("menuItem");
  res.status(201).json({
    success: true,
    message: "Review added successfully!",
    review: populatedReview,
  });
});

export const deleteReview = catchAsyncErrors(async (req, res,next) => {
  const {id}= req.params;
  let review= await Review.findById(id);
  if(!review){
    return next(new ErrorHandler("It's Already Deleted!", 404));
  }
// Check if the user is authorized to delete the review
if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
  return next(new ErrorHandler("You are not authorized to delete this review!", 403));
}
await review.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review  is  Deleted!",
  });
});

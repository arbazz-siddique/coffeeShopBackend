import {User} from "../models/User.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization?.split(" ")[1]; 

//   console.log("Token Received:", token); // Debugging Step

  if (!token) {
      return next(new ErrorHandler("User not Authenticated!", 401));
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //   console.log("Decoded Token:", decoded); // Debugging Step
      
      req.user = await User.findById(decoded.id);
      if (!req.user) {
          return next(new ErrorHandler("User not found!", 404));
      }

      next();
  } catch (error) {
      return next(new ErrorHandler("Invalid or Expired Token", 403));
  }
});

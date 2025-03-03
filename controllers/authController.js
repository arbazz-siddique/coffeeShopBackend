// controllers/authController.js
import {User} from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from '../middleware/error.js';
import { generateToken } from '../utils/jwtToken.js';
import crypto from "crypto"
import { kMaxLength } from 'buffer';

export const register = catchAsyncErrors(async(req, res, next) => {
  const { name, email, password } = req.body;
  const user= await User.create({
    name,
    email,
    password,
  })
  generateToken(user, "Registered!", 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please enter both email and password!" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found. Please register first!" });
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return res.status(401).json({ success: false, message: "Invalid email or password!" });
  }

  // 🔥 Ensure we send only necessary user details (exclude password)
  const userWithoutPassword = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  generateToken(userWithoutPassword, "Login Successful!", 200, res);
});
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      sameSite:"None",
      secure:true
    })
    .json({
      success: true,
      message: "Logged Out!",
    });
});


export const getUser = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const user = await User.findById(req.user._id).select("-password");

  res.status(200).json({
    success: true,
    user,
  });
});









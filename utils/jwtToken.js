import jwt from "jsonwebtoken";

export const generateToken = (user, message, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
  // console.log("Generated Token:", token);

  res
  .cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite:"None",
      secure:true
  })
  .status(statusCode)
  .json({
      success: true,
      message,
      user,
      token,
  });

};

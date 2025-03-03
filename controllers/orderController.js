import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";

// ✅ Get all orders
export const getOrders = catchAsyncErrors(async (req, res) => {
  const orders = await Order.find().populate('user items');
  res.status(200).json({
    success: true,
    orders,
  });
});

// ✅ Place an order

export const placeOrder = catchAsyncErrors(async (req, res, next) => {
  const { items, total } = req.body;

  // Validate if all menu items exist
  const menuItems = await MenuItem.find({ _id: { $in: items } });
  if (menuItems.length !== items.length) {
    return next(new ErrorHandler("Some menu items were not found", 400));
  }

  // Create the order
  const order = await Order.create({
    user: req.user.id,
    items,
    total,
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    order,
  });
});



// ✅ Update order status
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'processing', 'completed'].includes(status)) {
    return next(new ErrorHandler("Invalid status value", 400));
  }

  let order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler("Order not found!", 404));
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated!",
    order,
  });
});

// ✅ Delete an order
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  let order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler("Order not found!", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully!",
  });
});

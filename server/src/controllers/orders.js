const Order = require("../models/orders");
const Product = require("../models/products");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  const { cartItems, deliveryAddress } = req.body; // Buy now can be a single item in cartItems array
  const userId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;
    const orderItems = [];

    // Loop through cart items to validate stock and calculate total
    for (const item of cartItems) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(
          `Not enough stock for ${product.name}. Available: ${product.stock}`
        );
      }

      // Decrement stock
      product.stock -= item.quantity;
      await product.save({ session });

      const effectivePrice = product.isOnSale
        ? product.discountPrice
        : product.price;
      totalAmount += item.quantity * effectivePrice;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: effectivePrice,
        quantity: item.quantity,
      });
    }

    // If we used payment gateways then it would be here !!
    // For now, we'll assume it's successful.

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentDetails: { status: "completed" }, // Assuming payment is successful
      status: "processing", // Moving to processing once payment is done
    });

    await order.save({ session });

    await session.commitTransaction();

    res.status(201).json({ status: "success", data: order });
  } catch (error) {
    await session.abortTransaction();
    console.error("Order creation transaction failed:", error);
    if (error.name === "ValidationError") {
      console.error("Mongoose Validation Error Details:", error.errors);
    }
    res.status(400).json({
      status: "fail",
      message: error.message || "An unknown error occurred",
    });
  } finally {
    session.endSession();
  }
};

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      throw new Error("Order not found.");
    }
    if (order.user.toString() !== userId) {
      throw new Error("You are not authorized to cancel this order.");
    }
    if (!["pending", "processing"].includes(order.status)) {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    // This is where we refund via payment gateways

    order.status = "cancelled";
    await order.save({ session });

    await session.commitTransaction();
    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ status: "fail", message: error.message });
  } finally {
    session.endSession();
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json({ status: "success", data: orders });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports = { createOrder, cancelOrder, getMyOrders, getOrderById };

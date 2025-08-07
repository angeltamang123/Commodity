const Order = require("../models/orders");
const Product = require("../models/products");
const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const { notifyAllAdmins, notifyUser } = require("../utils/notificationHelpers");

const createOrder = async (req, res) => {
  const io = req.app.get("io");
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
      paymentDetails: { status: "completed", paymentId: randomUUID() }, // Assuming payment is successful, and random UUID
      status: "processing", // Moving to processing once payment is done
    });

    await order.save({ session });
    await session.commitTransaction();

    notifyAllAdmins(io, {
      message: `Order placed by user ${userId}`,
      type: "New Order",
    });

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

// order controller
const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;
  const io = req.app.get("io");
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

  try {
    const sockets = global.connectedUsers.get(userId);

    const isAdmin = Array.from(sockets || []).some((socketId) =>
      global.connectedAdmins.has(socketId)
    );

    if (!isAdmin) {
      notifyAllAdmins(io, {
        message: `Order placed by user ${userId} cancelled !!`,
        type: "Order Cancelled",
      });
    }

    notifyUser(io, userId, {
      message: `Your order (${orderId}) has been successfully cancelled.`,
      type: "Order Update",
    });
  } catch (notificationError) {
    console.error("Error sending notification:", notificationError);
  }
};

const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const pipeline = [];

    pipeline.push({
      $match: { user: new mongoose.Types.ObjectId(`${req.user.id}`) },
    });

    if (req.query.status) {
      pipeline.push({ $match: { status: req.query.status } });
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(`${req.query.q}`);

    if (req.query.q && isObjectId) {
      pipeline.push({
        $match: { _id: new mongoose.Types.ObjectId(`${req.query.q}`) },
      });
    }

    if (req.query.q && !isObjectId) {
      pipeline.push({ $unwind: "$items" });

      pipeline.push({
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      });

      pipeline.push({ $unwind: "$productDetails" });

      pipeline.push({
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          totalAmount: { $first: "$totalAmount" },
          deliveryAddress: { $first: "$deliveryAddress" },
          paymentDetails: { $first: "$paymentDetails" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          items: {
            $push: {
              product: "$items.product",
              name: "$items.name",
              price: "$items.price",
              quantity: "$items.quantity",
              productDetails: "$productDetails",
            },
          },
          hasMatchingProduct: {
            $max: {
              $cond: {
                if: {
                  $regexMatch: {
                    input: "$productDetails.name",
                    regex: req.query.q,
                    options: "i",
                  },
                },
                then: true,
                else: false,
              },
            },
          },
        },
      });

      pipeline.push({ $match: { hasMatchingProduct: true } });
      pipeline.push({ $project: { hasMatchingProduct: 0 } });
    }

    if (!req.query.q || isObjectId) {
      pipeline.push({ $unwind: "$items" });

      pipeline.push({
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      });

      pipeline.push({ $unwind: "$productDetails" });

      pipeline.push({
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          totalAmount: { $first: "$totalAmount" },
          deliveryAddress: { $first: "$deliveryAddress" },
          paymentDetails: { $first: "$paymentDetails" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          items: {
            $push: {
              product: "$items.product",
              name: "$items.name",
              price: "$items.price",
              quantity: "$items.quantity",
              productDetails: "$productDetails",
            },
          },
        },
      });
    }

    let sortStage = {};
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(":");
      sortStage[field] = order === "desc" ? -1 : 1;
    } else {
      sortStage = { updatedAt: -1 };
    }
    pipeline.push({ $sort: sortStage });

    const countPipeline = [...pipeline];
    countPipeline.push({ $count: "totalOrders" });
    const countResult = await Order.aggregate(countPipeline);
    const totalOrders = countResult[0]?.totalOrders || 0;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const orders = await Order.aggregate(pipeline);

    res.status(200).json({
      orders: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching user's orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
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

const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const pipeline = [];
    const initialMatch = {};

    // Check if the search query is a valid ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(`${req.query.q}`);

    if (req.query.q && isObjectId) {
      initialMatch._id = new mongoose.Types.ObjectId(`${req.query.q}`);
    }

    if (req.query.status) {
      initialMatch.status = req.query.status;
    }

    if (Object.keys(initialMatch).length > 0) {
      pipeline.push({ $match: initialMatch });
    }

    pipeline.push({
      $lookup: {
        from: "registers",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({ $unwind: "$items" });
    pipeline.push({
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "items.productDetails",
      },
    });
    pipeline.push({ $unwind: "$items.productDetails" });

    pipeline.push({
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        userDetails: { $first: "$userDetails" },
        totalAmount: { $first: "$totalAmount" },
        deliveryAddress: { $first: "$deliveryAddress" },
        paymentDetails: { $first: "$paymentDetails" },
        status: { $first: "$status" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        items: {
          $push: {
            product: "$items.product",
            name: "$items.name",
            price: "$items.price",
            quantity: "$items.quantity",
            productDetails: "$items.productDetails",
          },
        },
      },
    });

    if (req.query.q && !isObjectId) {
      pipeline.push({
        $match: {
          $or: [
            { "userDetails.fullName": { $regex: req.query.q, $options: "i" } },
            { "userDetails.emailId": { $regex: req.query.q, $options: "i" } },
          ],
        },
      });
    }

    let sortStage = {};
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(":");
      sortStage[field] = order === "desc" ? -1 : 1;
    } else {
      sortStage = { createdAt: -1 };
    }
    pipeline.push({ $sort: sortStage });

    const countPipeline = [...pipeline];
    countPipeline.push({ $count: "totalOrders" });
    const countResult = await Order.aggregate(countPipeline);
    const totalOrders = countResult[0]?.totalOrders || 0;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const orders = await Order.aggregate(pipeline);

    res.status(200).json({
      orders: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching orders for admin:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const io = req.app.get("io");

  if (!Order.schema.path("status").enumValues.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(orderId).populate(
      "user",
      "_id fullName emailId phoneNumber"
    );

    if (status === "departed") {
      notifyUser(io, updatedOrder.user._id.toString(), {
        message: `Your Order ${updatedOrder._id} has departed`,
        type: "Order Update",
      });
    }
    res.status(200).json({
      status: "success",
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

const getRevenueData = async (req, res) => {
  const { period = "month" } = req.query;
  let startDate, groupByFormat;

  const now = new Date();
  switch (period) {
    case "day":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
      ); // Last 24 hours
      groupByFormat = "%d-%H";
      break;
    case "week":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7
      );
      groupByFormat = "%m-%d";
      break;
    case "year":
      startDate = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      groupByFormat = "%Y-%m";
      break;
    case "month":
    default:
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      groupByFormat = "%m-%d";
  }

  try {
    const revenueData = await Order.aggregate([
      {
        $match: {
          "paymentDetails.status": "completed",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupByFormat,
              date: "$createdAt",
              timezone: period === "day" ? "Asia/Kathmandu" : "UTC",
            },
          },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", revenue: "$totalRevenue" } },
    ]);

    res.status(200).json({ status: "success", data: revenueData });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch revenue data." });
  }
};

const getRevenueByCategory = async (req, res) => {
  const { period = "all" } = req.query;
  let startDate;

  const now = new Date();
  switch (period) {
    case "day":
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "year":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
  }

  const matchStage = { status: "delivered" };
  if (startDate) {
    matchStage.createdAt = { $gte: startDate };
  }

  try {
    const revenueByCategory = await Order.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $project: { _id: 0, category: "$_id", revenue: "$revenue" } },
      { $sort: { revenue: -1 } },
    ]);

    res.status(200).json({ status: "success", data: revenueByCategory });
  } catch (error) {
    console.error("Error fetching category revenue:", error);
    res.status(500).json({ message: "Failed to fetch category revenue." });
  }
};

module.exports = {
  createOrder,
  cancelOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getRevenueByCategory,
  getRevenueData,
};

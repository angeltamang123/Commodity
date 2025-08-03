// /routes/orders.js
const { Router } = require("express");
const authMiddleware = require("../utils/authMiddleware");
const {
  createOrder,
  cancelOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getRevenueData,
  getRevenueByCategory,
} = require("../controllers/orders");

const router = Router();

router.use(authMiddleware.protect);

router.get("/orders/my-orders", getMyOrders);

router.post("/orders", createOrder);

router.get("/orders/revenue", getRevenueData);

router.get("/orders/revenue-by-category", getRevenueByCategory);

router.get("/orders/:orderId", getOrderById);

router.patch("/orders/:orderId/cancel", cancelOrder);

router.get("/orders", getAllOrders);

router.patch("/orders/:orderId/status", updateOrderStatus);

module.exports = router;

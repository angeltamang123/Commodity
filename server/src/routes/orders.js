// /routes/orders.js
const { Router } = require("express");
const authMiddleware = require("../utils/authMiddleware");
const {
  createOrder,
  cancelOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orders");

const router = Router();

router.use(authMiddleware.protect);

router.get("/orders/my-orders", getMyOrders);

router.post("/orders", createOrder);

router.get("/orders/:orderId", getOrderById);

router.patch("/orders/:orderId/cancel", cancelOrder);

module.exports = router;

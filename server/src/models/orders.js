const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true }, // Snapshot of product name
  price: { type: Number, required: true }, // Price at time of purchase
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema], // An array of items in the order
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      address: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    paymentDetails: {
      paymentId: { type: String },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "departed", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

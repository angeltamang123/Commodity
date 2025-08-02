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
      ref: "Register",
      required: true,
    },
    items: [orderItemSchema], // An array of items in the order
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      // Primary display address (most complete human-readable form)
      formattedAddress: { type: String, trim: true },

      name: { type: String }, // For specific entities
      street: { type: String },
      suburb: { type: String },
      district: { type: String },
      city: { type: String },
      county: { type: String },
      state: { type: String },
      country: { type: String },
      postcode: { type: String },

      coordinates: {
        lat: { type: Number },
        lon: { type: Number },
      },

      result_type: { type: String }, // e.g., 'suburb', 'amenity', 'street', 'house'
      place_id: { type: String }, // Unique ID from Geoapify
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

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "Register", required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["New Order", "Order Update", "System", "Order Cancelled"],
    default: "System",
  },
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.index({ userId: 1, isSeen: 1 });

module.exports = mongoose.model("Notification", notificationSchema);

const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: [
      "Electronics",
      "Clothings",
      "Books",
      "Furnitures",
      "Sports",
      "Others",
    ],
    default: "Others",
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  image: {
    type: String,
  },
  images: {
    type: [String],
    default: [],
  },
  discountPrice: {
    type: Number,
    min: 0,
    default: null,
  },
  discountTill: {
    type: Date,
    validate: {
      validator: function (value) {
        if (this.discountPrice === null || this.discountPrice === undefined) {
          // discountPrice not set → discountTill must NOT exist either
          return value === null || value === undefined;
        }
        // discountPrice is set → discountTill must be non-null and > tomorrow
        if (!value) return false;

        // Get tomorrow's date at 00:00:00
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        return value > tomorrow;
      },
      message:
        "discountTill must be greater than tomorrow when discountPrice is set and cannot be null",
    },
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.pre("save", function (next) {
  if (this.stock === 0) {
    this.status = "inactive";
  }
  // a user might try to set an out-of-stock product to 'active'.
  if (this.stock === 0 && this.status === "active") {
    this.status = "inactive";
  }

  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
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
        "Clothing",
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
    // // colors and sizes for clothing category
    // colors: {
    //   type: [String],
    //   default: undefined,
    // },
    // sizes: {
    //   type: [String], // Array of strings for available sizes (e.g., ["XS", "S", "M", "L", "XL"])
    //   default: undefined,
    // },
    rating: {
      average: { type: Number, default: null },
      count: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 },
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
    embedding: {
      type: [Number],
      default: null,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// A text index on the fields to search
productSchema.index({ name: "text", description: "text" });

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

// A virtual property to check if the product is currently on sale
productSchema.virtual("isOnSale").get(function () {
  return (
    this.discountPrice != null &&
    this.discountTill &&
    this.discountTill > new Date()
  );
});

// Define a virtual property for the final, effective price
productSchema.virtual("effectivePrice").get(function () {
  return this.isOnSale ? this.discountPrice : this.price;
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "A review must have a rating."],
      min: 1,
      max: 5,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "A review must belong to a product."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Register",
      required: [true, "A review must belong to a user."],
    },
    likes: {
      type: [mongoose.Schema.ObjectId],
      ref: "Register",
      default: [],
    },
  },
  { timestamps: true }
);

// Static function that recalculates Product's rating field
reviewSchema.statics.recalculateProductRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId }, // Filter for reviews of the specific product
    },
    {
      $group: {
        _id: "$product", // Group them together
        reviewCount: { $sum: 1 }, // Count the number of reviews
        averageRating: { $avg: "$rating" }, // Calculate the average of the 'rating' field
        fiveStarCount: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
        fourStarCount: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
        threeStarCount: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
        twoStarCount: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
        oneStarCount: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
      },
    },
  ]);

  // Update corresponding Product document
  if (stats.length > 0) {
    // If there are reviews, update the product with the new stats
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      rating: {
        count: stats[0].reviewCount,
        average: stats[0].averageRating,
        5: stats[0].fiveStarCount,
        4: stats[0].fourStarCount,
        3: stats[0].threeStarCount,
        2: stats[0].twoStarCount,
        1: stats[0].oneStarCount,
      },
    });
  } else {
    // If there are no reviews left (e.g., the last one was deleted), reset the rating
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      rating: {
        count: 0,
        average: 0,
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    });
  }
};

// Use Static function post saving
reviewSchema.post("save", async function () {
  await this.constructor.recalculateProductRating(this.product);
});

// Regex to run after a review is found and updated/deleted
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.recalculateProductRating(doc.product);
  }
});

// Index on product and user, and ensure a user can only review a product once.
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

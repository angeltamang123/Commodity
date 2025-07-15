const Review = require("../models/reviews");
const Product = require("../models/products");

const createReview = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id; // From auth middleware

    if (!productId || !userId || !req.body.rating) {
      return res.status(400).json({
        status: "fail",
        message: "Product ID, User ID, and Rating are required.",
      });
    }

    const reviewData = {
      comment: req.body.comment,
      rating: req.body.rating,
      product: productId,
      user: userId,
    };

    const newReview = await Review.create(reviewData);

    res.status(201).json({
      status: "success",
      data: newReview,
    });
  } catch (error) {
    // Potential duplicate key error (if user tries to review same product twice)
    if (error.code === 11000) {
      return res.status(409).json({
        status: "fail",
        message: "You have already submitted a review for this product.",
      });
    }
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ status: "fail", message: error.message });
    }
    console.error("Error creating review:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const getAllReviewsForProduct = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "fullName");

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews for product:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const checkUserReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(401)
        .json({ status: "fail", message: "User not authenticated." });
    }

    const review = await Review.findOne({
      product: productId,
      user: userId,
    }).populate("user", "fullName");

    if (review) {
      res.status(200).json({
        status: "success",
        hasReview: true,
        data: review,
      });
    } else {
      res.status(200).json({
        status: "success",
        hasReview: false,
        data: null,
      });
    }
  } catch (error) {
    console.error("Error checking user review:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "No review found with that ID" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to update this review.",
      });
    }

    const allowedUpdates = {};
    if (req.body.comment !== undefined)
      allowedUpdates.comment = req.body.comment;
    if (req.body.rating !== undefined) {
      allowedUpdates.rating = req.body.rating;
      if (allowedUpdates.rating < 1 || allowedUpdates.rating > 5) {
        return res
          .status(400)
          .json({ status: "fail", message: "Rating must be between 1 and 5." });
      }
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "No valid fields provided for update.",
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      allowedUpdates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "fullName ");

    res.status(200).json({
      status: "success",
      data: updatedReview,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ status: "fail", message: error.message });
    }
    console.error("Error updating review:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "No review found with that ID" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to delete this review.",
      });
    }

    await review.deleteOne();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

module.exports = {
  createReview,
  getAllReviewsForProduct,
  checkUserReview,
  updateReview,
  deleteReview,
};

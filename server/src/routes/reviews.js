const { Router } = require("express");
const authMiddleware = require("../utils/authMiddleware");
const {
  getAllReviewsForProduct,
  createReview,
  checkUserReview,
  updateReview,
  deleteReview,
  likeReview,
} = require("../controllers/reviews");

// By setting mergeParams: true, we can access :productId from the parent router.
const router = Router({ mergeParams: true });

router.get("/", getAllReviewsForProduct);
router.post("/", authMiddleware.protect, createReview);
router.get("/my-review", authMiddleware.protect, checkUserReview);
router.patch("/:reviewId", authMiddleware.protect, updateReview);
router.delete("/:reviewId", authMiddleware.protect, deleteReview);
router.patch("/:reviewId/like", authMiddleware.protect, likeReview);

module.exports = router;

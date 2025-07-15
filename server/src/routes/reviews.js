const { Router } = require("express");
const authMiddleware = require("../utils/authMiddleware");
const {
  getAllReviewsForProduct,
  createReview,
  checkUserReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

// // By setting mergeParams: true, we can access :productId from the parent router.
// const router = express.Router({ mergeParams: true });

const router = Router();

router.get("/reviews/:productId", getAllReviewsForProduct);
router.post("/reviews/:productId", authMiddleware.protect, createReview);
router.get(
  "/reviews/:productId/my-review",
  authMiddleware.protect,
  checkUserReview
);
router.patch(
  "/reviews/:productId/:reviewId",
  authMiddleware.protect,
  updateReview
);
router.delete(
  "/reviews/:productId/:reviewId",
  authMiddleware.protect,
  deleteReview
);

module.exports = router;

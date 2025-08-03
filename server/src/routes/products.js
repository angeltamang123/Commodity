const { Router } = require("express");
const multer = require("multer");
const {
  registerNewProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleStatus,
  getLatest,
  getDiscountedProducts,
  getStatsCards,
  getProductCountByCategory,
} = require("../controllers/products");

const authMiddleware = require("../utils/authMiddleware");

const reviewRouter = require("./reviews");

const router = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/products", (req, res) => {
  if (req.query.latest === "true") {
    return getLatest(req, res);
  } else if (req.query.deals === "true") {
    return getDiscountedProducts(req, res);
  }
  return getAllProducts(req, res);
});
router.get("/products/stats-cards", authMiddleware.protect, getStatsCards);

router.get(
  "/products/product-count-by-category",
  authMiddleware.protect,
  getProductCountByCategory
);
router.get("/products/:productId", getProductById);
router.patch(
  "/products/:productId",
  authMiddleware.protect,
  upload.fields([
    { name: "image", maxCount: 1 }, // For the single main product image
    { name: "images[]", maxCount: 5 }, // For the array of additional images
  ]),
  updateProduct
);
router.delete("/products/:productId", authMiddleware.protect, deleteProduct);

router.post(
  "/products",
  authMiddleware.protect,
  upload.fields([
    { name: "image", maxCount: 1 }, // For the single main product image
    { name: "images[]", maxCount: 5 }, // For the array of additional images
  ]),
  registerNewProduct
);

router.patch(
  "/products/:productId/toggleStatus",
  authMiddleware.protect,
  toggleStatus
);

router.use("/products/:productId/reviews", reviewRouter);

module.exports = router;

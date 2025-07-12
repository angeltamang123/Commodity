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
} = require("../controllers/products");
const app = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/products", (req, res) => {
  if (req.query.latest === "true") {
    return getLatest(req, res);
  } else if (req.query.deals === "true") {
    return getDiscountedProducts(req, res);
  }
  return getAllProducts(req, res);
});
app.get("/products/:productId", getProductById);
app.patch(
  "/products/:productId",
  upload.fields([
    { name: "image", maxCount: 1 }, // For the single main product image
    { name: "images[]", maxCount: 5 }, // For the array of additional images
  ]),
  updateProduct
);
app.delete("/products/:productId", deleteProduct);

app.post(
  "/products",
  upload.fields([
    { name: "image", maxCount: 1 }, // For the single main product image
    { name: "images[]", maxCount: 5 }, // For the array of additional images
  ]),
  registerNewProduct
);

app.patch("/products/:productId/toggleStatus", toggleStatus);

module.exports = app;

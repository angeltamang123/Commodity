const { Router } = require("express");
const {
  registerNewUser,
  loginUser,
  addToWishList,
  removeFromWishList,
} = require("../controllers/users");
const router = Router();
const authMiddleware = require("../utils/authMiddleware");

router.post("/register", registerNewUser);
router.post("/login", loginUser);
router.patch(
  "/user/:userId/add-wishlist",
  authMiddleware.protect,
  addToWishList
);
router.patch(
  "/user/:userId/remove-wishlist",
  authMiddleware.protect,
  removeFromWishList
);

module.exports = router;

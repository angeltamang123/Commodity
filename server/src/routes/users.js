const { Router } = require("express");
const {
  registerNewUser,
  loginUser,
  addToWishList,
  removeFromWishList,
  updateProfile,
  checkPassword,
  changePassword,
} = require("../controllers/users");
const router = Router();
const authMiddleware = require("../utils/authMiddleware");

router.post("/register", registerNewUser);
router.post("/login", loginUser);
router.post("/user/change-password", authMiddleware.protect, changePassword);
router.post("/user/check-password", authMiddleware.protect, checkPassword);
router.patch("/user/:userId", authMiddleware.protect, updateProfile);
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

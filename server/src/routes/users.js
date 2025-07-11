const { Router } = require("express");
const {
  registerNewUser,
  loginUser,
  addToWishList,
  removeFromWishList,
} = require("../controllers/users");
const app = Router();

app.post("/register", registerNewUser);
app.post("/login", loginUser);
app.patch("/user/:userId/add-wishlist", addToWishList);
app.patch("/user/:userId/remove-wishlist", removeFromWishList);

module.exports = app;

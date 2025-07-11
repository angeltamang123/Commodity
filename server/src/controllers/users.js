const Register = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerNewUser = async (req, res) => {
  const isExist = await Register.exists({ emailId: req.body.emailId });
  if (isExist) return res.status(409).send("Email is taken");
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  Register.create(req.body);
  res.send("User Created Successfully");
};

const loginUser = async (req, res) => {
  const user = await Register.findOne({ emailId: req.body.emailId });
  if (!user) return res.send("Email does not exist");

  const passwordMatched = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordMatched) return res.status(401).send("Invalid Password");
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ emailId: req.body.emailId }, secret);
  res.send({
    message: "logged in successfully",
    user: user,
    isLoggedIn: true,
    token,
  });
};

const addToWishList = async (req, res) => {
  try {
    const user = await Register.findById(req.params.userId);
    user.wishlist.push(req.body.product);
    user.save();
    res.status(204).json({ message: "Product added in Wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWishList = async (req, res) => {
  try {
    const user = await Register.findById(req.params.userId);
    const productId = req.body.product;
    const initialWishlistLength = user.wishlist.length;
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );

    if (user.wishlist.length === initialWishlistLength) {
      return res
        .status(404)
        .json({ message: "Product not found in wishlist." });
    }

    await user.save();

    res.status(200).json({ message: "Product removed from Wishlist." });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error while removing from wishlist.",
    });
  }
};

module.exports = {
  registerNewUser,
  loginUser,
  addToWishList,
  removeFromWishList,
};

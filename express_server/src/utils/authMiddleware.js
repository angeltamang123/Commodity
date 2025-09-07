const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { promisify } = require("util");

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return res.status(401).json({
        status: "fail",
        message: "Server configuration error: JWT_SECRET missing",
      });
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // Using promisify to await jwt.verify, which is callback-based
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists, decoded.id is the user._id which signed the token
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token. Please log in again!",
      });
    }
    console.error("Authentication error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong during authentication.",
    });
  }
};

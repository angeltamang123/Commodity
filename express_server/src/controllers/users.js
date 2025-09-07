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
  const payload = {
    id: user._id,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);

  const tenYearsFromNow = new Date();
  tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);

  // Http only Cookie with long expiry date
  res.cookie("token", token, {
    httpOnly: true, // http only, prevents client side access
    secure: false, // set true in production, for https protocol. Rn, we have http local server
    expires: tenYearsFromNow,
    // Check other options in documentation
  });

  const userToSend = user.toObject();
  delete userToSend.password;
  delete userToSend.role;

  res.send({
    message: "logged in successfully",
    user: userToSend,
    isLoggedIn: true,
  });
};

const checkPassword = async (req, res) => {
  try {
    const user = await Register.findOne({ _id: req.user.id });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const passwordMatched = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatched)
      return res.status(401).json({ message: "Invalid Password" });
    res.status(200).json({ message: "Password Correct" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await Register.findOne({ _id: req.user.id });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const salt = await bcrypt.genSalt(10);
    req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);

    user.password = req.body.newPassword;

    user.save();
    res.status(200).json({ message: "Password Changed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const updateProfile = async (req, res) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "This route is not for password updates.",
      });
    }

    const filteredBody = filterObj(
      req.body,
      "fullName",
      "location",
      "emailId",
      "phoneNumber",
      "gender"
    );

    // Existence check for emailId
    if (filteredBody.emailId) {
      const existingUser = await Register.findOne({
        emailId: filteredBody.emailId,
        _id: { $ne: req.params.userId },
      });

      if (existingUser) {
        return res.status(400).json({
          status: "fail",
          message: "This email address is already in use by another user.",
        });
      }
    }

    // Existence check for phoneNumber
    if (filteredBody.phoneNumber) {
      const existingUser = await Register.findOne({
        phoneNumber: filteredBody.phoneNumber,
        _id: { $ne: req.params.userId },
      });

      if (existingUser) {
        return res.status(400).json({
          status: "fail",
          message: "This phone number is already in use by another user.",
        });
      }
    }

    const updatedUser = await Register.findByIdAndUpdate(
      req.params.userId,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      updatedUser: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

const changeRole = async (req, res) => {
  try {
    const newRole = req.body.role;
    const user = await Register.findById(req.user);
    user.role = newRole;
    await user.save();

    const secret = process.env.JWT_SECRET;
    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, secret);

    const tenYearsFromNow = new Date();
    tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);

    // Http only Cookie with long expiry date
    res.cookie("token", token, {
      httpOnly: true, // http only, prevents client side access
      secure: false, // set true in production, for https protocol. Rn, we have http local server
      expires: tenYearsFromNow,
      // Check other options in documentation
    });
    res.status(200).json({ message: "Role changed successfully." });
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
  updateProfile,
  checkPassword,
  changePassword,
  changeRole,
};

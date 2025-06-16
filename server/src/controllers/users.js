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
    token,
    user,
  });
};
module.exports = { registerNewUser, loginUser };

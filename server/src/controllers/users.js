const Register = require("../models/users");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");

const registerNewUser = async (req, res) => {
  const isExist = await Register.exists({ emailId: req.body.emailId });
  if (isExist) return res.status(409).send("Email is taken");
  req.body.password = bcrypt.hashSync(req.body.password, salt);
  Register.create(req.body);
  res.send("User Created Successfully");
};

const loginUser = async (req, res) => {
  const user = await Register.findOne({ emailId: req.body.emailId });
  if (!user) return res.send("Email does not exist");

  const passwordMatched = await bcrypt.compareSync(
    req.body.password,
    user.password
  );
  if (!passwordMatched) return res.status(401).send("Invalid Password");
  const token = jwt.sign(
    { emailId: req.body.emailId },
    "33d4cf9180ce11afdb8f6c4aeedf35220c62f23ea0a0efae97366b2732fb1b5b85fbdf50b074e30bc6d0c93445dc52b102cfcde9f5a596dd3427d0d623f86e1a1b9e97ceecbc6490b143aa0606f5c28892ec04b2f8f519f06671577aefb21a2311fbf173479f6eef0acde0b563b72ca48bc45642527c9914a5f68636bf5e12b4"
  );
  res.send({
    token,
    user,
  });
};
module.exports = { registerNewUser, loginUser };

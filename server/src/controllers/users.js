const Register = require("../models/users");

const registerNewUser = (req, res) => {
  Register.create(req.body);
  res.send("New account created!!");
};

const loginUser = (req, res) => {
  res.send("Ok");
};
module.exports = { registerNewUser, loginUser };

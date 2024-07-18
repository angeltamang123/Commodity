const Register = require("../models/users");

const registerNewUser = (req, res) => {
  try {
    Register.create(req.body);
    res.send("New account created!!");
  } catch (err) {
    res.send("something went wrong!!");
  }
};

const loginUser = (req, res) => {
  res.send("Ok");
};
module.exports = { registerNewUser, loginUser };

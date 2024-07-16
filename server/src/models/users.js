const mongoose = require("mongoose");
const { Schema } = mongoose;

const registerSchema = new Schema({
  name: String,
  address: String,
  emailId: String,
  phoneNumber: Number,
  password: String,
  rePassword: String,
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    default: "Male",
  },
});

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const registerSchema = new Schema({
  fullName: String,
  address: String,
  emailId: String,
  phoneNumber: Number,
  password: String,
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    default: "Male",
  },
});

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;

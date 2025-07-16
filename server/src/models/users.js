const mongoose = require("mongoose");
const { Schema } = mongoose;

const registerSchema = new Schema(
  {
    fullName: { type: String, trim: true },
    location: {
      address: { type: String, trim: true },
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    emailId: { type: String, trim: true },
    phoneNumber: Number,
    password: {
      type: String,
      required: [true, "Password is required"],
      // select: false, with select false find operation won't return this field
      // (can be returned as find().select('+password') ) for simplicity I will leave it on
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      default: "Male",
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;

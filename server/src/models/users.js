const mongoose = require("mongoose");
const { Schema } = mongoose;

const registerSchema = new Schema(
  {
    fullName: { type: String, trim: true },
    location: {
      // Primary display address (most complete human-readable form)
      formattedAddress: { type: String, trim: true },

      name: { type: String }, // For specific entities
      street: { type: String },
      suburb: { type: String },
      district: { type: String },
      city: { type: String },
      county: { type: String },
      state: { type: String },
      country: { type: String },
      postcode: { type: String },

      coordinates: {
        lat: { type: Number },
        lon: { type: Number },
      },

      result_type: { type: String }, // e.g., 'suburb', 'amenity', 'street', 'house'
      place_id: { type: String }, // Unique ID from Geoapify
    },
    emailId: { type: String, trim: true, unique: true },
    phoneNumber: { type: Number, unique: true },
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

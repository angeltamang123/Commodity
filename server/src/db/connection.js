const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/enterpriseDb");
    console.log("connected to mongodb");
  } catch (error) {
    console.error("connection failed:", error.message);
    process.exit(1); // Exit the application if the connection fails
  }
};

module.exports = connect;

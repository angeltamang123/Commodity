const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/enterpriseDb`);
    console.log("connected to mongodb");
  } catch (error) {
    console.error("connection failed:", error.message);
    process.exit(1); // Exit the application if the connection fails
  }
};

module.exports = connect;

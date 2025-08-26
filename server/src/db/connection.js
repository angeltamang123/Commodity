const mongoose = require("mongoose");

const connect = async () => {
  try {
    const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DB}?retryWrites=true&w=majority&appName=Cluster0`;
    const opts = {
      serverSelectionTimeoutMS: 15000,
    };
    await mongoose.connect(MONGODB_URI, opts);
    console.log("connected to mongodb");
  } catch (error) {
    console.error("connection failed:", error.message);
    process.exit(1); // Exit the application if the connection fails
  }
};

module.exports = connect;

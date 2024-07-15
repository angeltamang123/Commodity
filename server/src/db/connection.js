const mongoose = require("mongoose");
const connect = async () => {
  const connected = await mongoose.connect(
    "mongodb://127.0.0.1:27017/enterpriseDb"
  );
  if (connected) {
    console.log("connected to mongodb");
  } else {
    console.log("connection failed");
  }
};

module.exports = connect;

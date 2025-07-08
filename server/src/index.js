const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
// dot env config
dotenv.config();
const port = process.env.PORT || 7000;

app.use(cors());

app.use("/uploads", express.static("uploads"));

const productRoute = require("./routes/products");
app.use(productRoute);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form-urlencoded

const userRoute = require("./routes/users");
app.use(userRoute);

const connect = require("./db/connection"); //importing db
connect(); //function for connecting db

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

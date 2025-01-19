const express = require("express");
const app = express();
const cors = require("cors");
const port = 9000;
app.use(express.json());
const userRoute = require("./routes/users");
const productRoute = require("./routes/product");
app.use('/uploads', express.static('uploads'))

app.use(cors());
app.use(userRoute);
app.use(productRoute);


const connect = require("./db/connection"); //importing db
connect(); //function for connecting db

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

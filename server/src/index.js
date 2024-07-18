const express = require("express");
const app = express();
const cors = require("cors");
const port = 7000;
app.use(express.json());
const userRoute = require("./routes/users");
app.use(userRoute);
app.use(cors());

const connect = require("./db/connection"); //importing db
connect(); //function for connecting db

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

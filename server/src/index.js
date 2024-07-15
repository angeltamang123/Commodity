const express = require("express");
const app = express();
const port = 7000;

const userRoute = require("./routes/users");
app.use(userRoute);

const connect = require("./db/connection"); //importing db
connect(); //function for connecting db

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

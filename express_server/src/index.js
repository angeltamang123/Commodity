const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const cors = require("cors");

const dotenv = require("dotenv");
// dot env config
dotenv.config();

const port = process.env.PORT || 7000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form-urlencoded

app.use("/uploads", express.static("uploads"));

// Setup Socket.IO
const socketSetup = require("./socket");
socketSetup(io); // Passing io to socket file

const productRoute = require("./routes/products");
app.use(productRoute);

const userRoute = require("./routes/users");
app.use(userRoute);

const orderRoute = require("./routes/orders");
app.use(orderRoute);

const notificationsRoute = require("./routes/notifications");
app.use(notificationsRoute);

const connect = require("./db/connection"); //importing db
connect(); //function for connecting db

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

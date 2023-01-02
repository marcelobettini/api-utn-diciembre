require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db.js");

const PORT = process.env.PORT || 3030;
const server = express();

//express core middlewares
server.use(express.static("public"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//external middlewares
server.use(cors());

//users routing
server.use("/api/users", require("./users/usersRt"));

server.listen(PORT, (err) => {
  !err
    ? console.log(`Server up: http://localhost:${PORT}`)
    : console.log(`Server down du to: ${err}`);
});

//404
server.use((req, res, next) => {
  let error = new Error();
  error.message = "Resource Not Found";
  error.status = 404;
  next(error);
});

//general error handler
server.use((error, req, res, next) => {
  res
    .status(error.status)
    .json({ status: error.status, message: error.message });
});

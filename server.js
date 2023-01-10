require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db.js");
const path = require("path");
//handlebars for reset password form
const exphbs = require("express-handlebars");

const PORT = process.env.PORT || 3030;
const server = express();
//Load bootstrap directory reference
server.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
server.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
//Handlebars settings
const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),

  partialsDir: path.join(__dirname, "views/partials"),
  helpers: {
    errBelowInput: function (arrWarnings, inputName) {
      if (!arrWarnings) return null;
      const warning = arrWarnings.find((el) => el.param === inputName);
      if (warning == undefined) {
        return null;
      } else {
        return `
       <div class="alert alert-danger mt-1" role="alert">
       ${warning.msg}
       <button type="button" class="btn-close"
       data-bs-dismiss="alert"
       aria-label="Close"></button>
       </div>
        `;
      }
    },
  },
});

server.set("views", "./views");
server.engine("handlebars", hbs.engine);
server.set("view engine", "handlebars");

//express core middlewares
server.use(express.static("public"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//external middlewares
server.use(cors());

//users routing
server.use("/api/users", require("./users/usersRt"));
//posts routing
server.use("/api/posts", require("./posts/postsRt"));

server.listen(PORT, (err) => {
  !err
    ? console.log(`Server up: http://localhost:${PORT}`)
    : console.log(`Server down du to: ${err}`);
});

//404
server.use((req, res, next) => {
  console.log("404 handler");
  let error = new Error();
  error.message = "Resource Not Found";
  error.status = 404;
  next(error);
});

//general error handler
server.use((error, req, res, next) => {
  if (!error.status) error.status = 400;
  res
    .status(error.status)
    .json({ status: error.status, message: error.message });
});

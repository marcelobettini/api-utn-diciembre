const express = require("express");
require("./config/db.js");

const PORT = process.env.PORT || 3030;
const server = express();

//express core middlewares
server.use(express.static('public'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//users routing
server.use("/api/users", require("./users/usersRt"));

server.listen(PORT, (err) => {

  !err ?
    console.log(`Server up: http://localhost:${PORT}`)
    :
    console.log(`Server down du to: ${err}`);

});


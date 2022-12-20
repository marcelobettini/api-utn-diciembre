require("dotenv").config();
require("./config/db");
const express = require('express');

const PORT = process.env.PORT || 3030;
const server = express();

server.get('/api/teams', (req, res) => {
  res.send("accedemos a los equipos");
});

server.post('/api/teams', (req, res) => {
  res.send("Agregamos un equipo");
});

server.delete('/api/teams/:id', (req, res) => {
  res.send("Borramos el equipo " + req.params.id);
});


server.use(express.static('public'));

server.listen(PORT, (err) => {

  !err ?
    console.log(`Server up: http://localhost:${PORT}`)
    :
    console.log(`Server down du to: ${err}`);

});


//Mongo DB Atlas cloud connection

require("dotenv").config();

const mongoose = require("mongoose");

//A apartir de versión 6 de Mongoose no es necesario.
const options = {
  maxPoolSize: 100,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const db_uri = process.env.db_uri;
mongoose.set('strictQuery', false);
mongoose.connect(db_uri, options, (err) => {
  err ? console.log(`No pudo conectar a Mongo Atlas: ${err.message}`) :
    console.log('Mongo Atlas conectado OK');
});

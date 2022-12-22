const bc = require("../utils/handlePassword");

const User = require("./usersMd");
//get all users //TODO: improve this mess
const getAllUsers = (req, res) => {
  User.find().then((data) => {
    !data.length ? res.json({ message: "not found" }).status(404) : res.json(data).status(200);
    res.json(data);
  }).catch((error) => console.log(error));
};

//create user
const createUser = async (req, res) => {
  const password = await bc.hashPassword(req.body.password);

  //send to database
  const newUser = new User({ ...req.body, password });
  newUser.save((error, result) => {
    console.log(result);
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(200).json(newUser);
    }
  });

};

//delete user by id
const deleteUserById = (req, res) => {
  res.send(`<h2>Estamos en el enrutador de ${req.baseUrl}. Vamos a borrar el resource id: ${req.params.id}`);
};

module.exports = { getAllUsers, deleteUserById, createUser };
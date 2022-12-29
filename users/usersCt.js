const bc = require("../utils/handlePassword");
const User = require("./usersMd");
const public_url = process.env.public_url;

//get all users //TODO: improve this mess
const getAllUsers = (req, res) => {
  User.find().then((data) => {
    !data.length ? res.status(404).json({ message: "not found" }) : res.status(200).json(data);

  }).catch((error) => res.status(500).json({ message: error }));
};

//create user
const createUser = async (req, res) => {

  const profilePic = `${public_url}/storage/${req.file.filename}`;

  const password = await bc.hashPassword(req.body.password);

  //send to database
  const newUser = new User({ ...req.body, profilePic, password });
  newUser.save((error, result) => {

    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(200).json(newUser);
    }
  });

};

//update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "usuario con cambios", usuario: user });

  } catch (error) {
    res.status(404).json({ message: "Usuario no encontrado" });
  }

};

//delete user by id
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ user: user.id, message: "Usuario borrado" });
  } catch (error) {
    res.status(404).json({ message: "Usuario no encontrado" });
  }

};

module.exports = { getAllUsers, deleteUserById, createUser, updateUser };
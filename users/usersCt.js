const bc = require("../utils/handlePassword");
const User = require("./usersMd");
const public_url = process.env.public_url;

//get all users //TODO: improve this mess
const getAllUsers = (req, res, next) => {
  User.find()
    .then((data) => {
      !data.length ? next() : res.status(200).json(data);
    })
    .catch((error) => {
      error.status = 500;
      next(error);
    });
};

//create user
const createUser = async (req, res, next) => {
  const profilePic = `${public_url}/storage/${req.file.filename}`;

  const password = await bc.hashPassword(req.body.password);

  //send to database
  const newUser = new User({ ...req.body, profilePic, password });
  newUser.save((error, result) => {
    if (error) {
      error.status = 400;
      next(error);
    } else {
      res.status(200).json(newUser);
    }
  });
};

//update user
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "usuario con cambios", usuario: user });
  } catch (error) {
    next();
  }
};

//delete user by id
const deleteUserById = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ user: user.id, message: "Usuario borrado" });
  } catch (error) {
    next();
  }
};

module.exports = { getAllUsers, deleteUserById, createUser, updateUser };

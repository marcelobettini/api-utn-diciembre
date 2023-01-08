const bc = require("../utils/handlePassword");
const User = require("./usersMd");
const public_url = process.env.public_url;
const jwt = require("../utils/handleJWT");

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
  let pic = "";
  if (req.file) {
    pic = `${public_url}/storage/${req.file.filename}`;
  }
  const password = await bc.hashPassword(req.body.password);

  //send to database
  const newUser = new User({ ...req.body, profilePic: pic, password });
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
//Login (en un proyecto real, sería conveniente tener un servicio de autorización y autenticación con el manejo de register y login)
const loginUser = async (req, res, next) => {
  let error = new Error("Email or Password Invalid");
  const user = await User.find().where({ email: req.body.email });
  if (!user.length) {
    error.status = 401;
    return next(error);
  }
  const hashedPassword = user[0].password;
  const match = await bc.checkPassword(req.body.password, hashedPassword);
  if (!match) {
    error.status = 401;
    return next(error);
  }

  //gestión de token
  const userForToken = {
    email: user[0].email,
    fullName: user[0].fullName,
    userName: user[0].userName,
  };

  const accessToken = await jwt.tokenSign(userForToken, "24h");
  res.status(200).json({
    message: "access granted",
    token: accessToken,
    userData: userForToken,
  });
};

module.exports = {
  getAllUsers,
  deleteUserById,
  createUser,
  updateUser,
  loginUser,
};

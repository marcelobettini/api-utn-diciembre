const bc = require("../utils/handlePassword");
const User = require("./usersMd");
const public_url = process.env.public_url;
const jwt = require("../utils/handleJWT");
const transporter = require("../utils/handleMailer");

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
//FORGOT PASSWORD (Este servicio enviará un email con un link de recuperación de contraseña el email del usuario regustrado en la base de datos. Desde ese link, que incluirá un token de seguridad, podremos ir al formulario de recuperación y este vinculará con el procedimiento de restauración de contraseña -> esta persistirá en la base de datos (en el documento del usuario en cuestión)
const forgot = async (req, res, next) => {
  //existe el mail?
  let error = new Error("No user with than email");
  const user = await User.find().where({ email: req.body.email });
  if (!user.length) {
    error.status = 404;
    return next(error);
  }
  //si existe el email, generamos el token de seguridad y el link de restauración de contraseña que enviaremos al usuario
  const userForToken = {
    id: user[0].id,
    name: user[0].fullName,
    email: user[0].email,
  };
  const token = await jwt.tokenSign(userForToken, "15m");
  const link = `${process.env.public_url}/api/users/reset/${token}`;

  //creamos el cuerpo del mail, lo enviamos al usuario e indicamos esto en la response
  const mailDetails = {
    from: "Tech-Support@mydomain.com",
    to: userForToken.email,
    subject: "Password recovery magic link",
    html: `<h2>Password Recovery Service</h2>
  <p>To reset your password, please click the link and type in a new password</p>
  <a href="${link}">click to reset password</a>
  `,
  };

  transporter.sendMail(mailDetails, (error, data) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({
        message: `Hi ${userForToken.name}, we've sent an email with instructions to ${userForToken.email}`,
      });
    }
  });
};
const reset = async (req, res, next) => {
  const { token } = req.params;
  const tokenStatus = await jwt.tokenVerify(token);
  if (tokenStatus instanceof Error) {
    return next(tokenStatus);
  }
  res.render("reset", { token, tokenStatus });
};
const saveNewPass = async (req, res, next) => {
  const { token } = req.params;
  const tokenStatus = await jwt.tokenVerify(token);
  if (tokenStatus instanceof Error) return next(tokenStatus);
  const newPassword = await bc.hashPassword(req.body.password_1);
  try {
    const updatedUser = await User.findByIdAndUpdate(tokenStatus.id, {
      password: newPassword,
    });
    res
      .status(200)
      .json({ message: `Password changed for user ${tokenStatus.name}` });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllUsers,
  deleteUserById,
  createUser,
  updateUser,
  loginUser,
  forgot,
  reset,
  saveNewPass,
};

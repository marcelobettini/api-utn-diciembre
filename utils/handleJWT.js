const jwt = require("jsonwebtoken");
const jwt_secret = process.env.jwt_secret;
/* crea el token, recibe el objeto "usuario" (payload con user data de la DB)*/
const tokenSign = async (user, time) => {
  const sign = jwt.sign(user, jwt_secret, { expiresIn: time });
  return sign;
};

/*verifica que el token haya sido firmado por el backend, el método recibe el token de sesión */
const tokenVerify = async (tokenJWT) => {
  try {
    return jwt.verify(tokenJWT, jwt_secret);
  } catch (error) {
    return error;
  }
};

module.exports = { tokenSign, tokenVerify };

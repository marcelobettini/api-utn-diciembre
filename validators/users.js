const { check, validationResult } = require("express-validator");
const validatorCreateUser = [
  check("fullName")
    .trim()
    .notEmpty()
    .withMessage("Filed cannot be empty")
    .isAlpha("es-ES", { ignore: " " }) //ojo con espacios... los necesitamos
    .withMessage("Only letters")
    .isLength({ min: 5, max: 90 })
    .withMessage("Character count: min 5, max 90"),
  check("userName").trim().notEmpty().withMessage("Filed cannot be empty"),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Filed cannot be empty")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Filed cannot be empty")
    .isLength({ min: 8, max: 16 })
    .withMessage("Character count: min 8, max 16"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    } else {
      return next();
    }
  },
];
module.exports = { validatorCreateUser };

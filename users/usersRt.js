const router = require("express").Router();
const uploadPic = require("../utils/handleStorage");
const validator = require("../validators/users");
const userCt = require("./usersCt");
router.get("/", userCt.getAllUsers);
router.post(
  "/",
  uploadPic.single("profilePic"),
  validator.validatorCreateUser,
  userCt.createUser
);
router.put("/:id", userCt.updateUser);
router.delete("/:id", userCt.deleteUserById);
router.post("/login", userCt.loginUser);

module.exports = router;

const router = require("express").Router();
const uploadPic = require("../utils/handleStorage");
const validator = require("../validators/users");
const userCt = require("./usersCt");
router.get("/", userCt.getAllUsers);
router.post(
  "/",
  uploadPic.single("profilePic"),
  validator.createUser,
  userCt.createUser
);
router.put("/:id", userCt.updateUser);
router.delete("/:id", userCt.deleteUserById);
router.post("/login", userCt.loginUser);
//SEND REQUEST FOR PASSWORD RESETTING
router.post("/forgot-password", userCt.forgot);
//MAGIC LINK REDIRECTS TO RESET FORM
router.get("/reset/:token", userCt.reset);
//process reset form
router.post("/reset/:token", validator.resetPassword, userCt.saveNewPass);

module.exports = router;

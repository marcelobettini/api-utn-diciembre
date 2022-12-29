const router = require("express").Router();
const uploadPic = require("../utils/handleStorage");
const userCt = require("./usersCt");
router.get("/", userCt.getAllUsers);
router.post("/", uploadPic.single("profilePic"), userCt.createUser);
router.put("/:id", userCt.updateUser);
router.delete("/:id", userCt.deleteUserById);


module.exports = router;


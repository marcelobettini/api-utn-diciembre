const router = require("express").Router();
const userCt = require("./usersCt");
router.get("/", userCt.getAllUsers);
router.post("/", userCt.createUser);
router.delete("/:id", userCt.deleteUserById);


module.exports = router;


const postCt = require("./postsCt");
const isAuth = require("../middlewares/session");
const router = require("express").Router();
router.get("/", postCt.listAllPosts);
router.post("/", isAuth, postCt.createNewPost);
router.get("/find/:query", postCt.findByTitle);
module.exports = router;

const { allUsers } = require("../controllers/allUsers");
const { getUserMessages } = require("../controllers/getUserMessages");
const { userDetails } = require("../controllers/userDetails");

const router = require("express").Router();

router.route("/allUsers").post(allUsers);
router.route("/userDetails/:userid").get(userDetails);
router.route("/getUserMessages/:userid").get(getUserMessages);

module.exports = router;

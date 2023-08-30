const { allUsers } = require("../controllers/allUsers");
const { userDetails } = require("../controllers/userDetails");

const router = require("express").Router();

router.route("/allUsers").get(allUsers);
router.route("/userDetails/:userid").get(userDetails);

module.exports = router;

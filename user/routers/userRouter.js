const router = require("express").Router();
const {
  sendOtp,
  register,
} = require("../controllers/userController");
const { login } = require("../controllers/loginController");
const { addCreditCard } = require("../controllers/creditController");
const { updateLocation } = require("../controllers/locationController");
const { updateMessages } = require("../controllers/messageController");


router.route("/sendOtp").post(sendOtp);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/submitCreditDetails").post(addCreditCard);
router.route("/updateLocation").post(updateLocation);
router.route("/updateMessages").post(updateMessages);

module.exports = router;

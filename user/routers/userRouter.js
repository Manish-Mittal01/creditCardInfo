const router = require("express").Router();
const {
  sendOtp,
  register,
} = require("../controllers/userController");
const { login } = require("../controllers/loginController");
const { addCreditCard } = require("../controllers/creditController");


router.route("/sendOtp").post(sendOtp);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/submitCreditDetails").post(addCreditCard);

module.exports = router;

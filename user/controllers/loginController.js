const User = require("../Models/UserModel");
const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCode } = require("../../common/Constants");
const { UserController } = require("./userController");
const { ResponseService } = require("../../common/responseService");
const { LogService } = require("../../common/logService");
const { success, error } = require("../../common/Constants").Status;

module.exports.login = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile) return ResponseService.failed(res, "mobile is required", StatusCode.badRequest)
  if (!password) return ResponseService.failed(res, "password is required", StatusCode.badRequest)


  const user = await User.findOne({
    mobile: mobile,
  });

  if (!user) {
    return ResponseService.failed(res, "User not Found", StatusCode.notFound);
  }
  // else {
  //   if (user.token !== token || user._id !== userId) return ResponseService.failed(res, "Invalid token or userId", StatusCode.unauthorized)
  // }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (user.mobile === mobile && isPasswordCorrect) {
    const newUser = new User(user)
    // const token = jwt.sign(
    //   {
    //     userId: user._id,
    //     mobile: user.mobile,
    //   },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: "7d" }
    // );

    const token = newUser.generateJWT();
    newUser.token = token
    let result = await newUser.save()
    result = result._doc
    delete result.password


    return ResponseService.success(res, "Login successfully", result)

  } else {
    return ResponseService.failed(res, "Incorrect Mobile or Password", StatusCode.badRequest);
  }
};

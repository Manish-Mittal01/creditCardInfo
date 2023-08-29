const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const { StatusCode } = require("../../common/Constants");
const { ResponseService } = require("../../common/responseService");
const Admin = require("../../admin/models/adminModel")

module.exports.login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile) return ResponseService.failed(res, "mobile is required", StatusCode.badRequest)
    if (!password) return ResponseService.failed(res, "password is required", StatusCode.badRequest)


    const user = await User.findOne({
      mobile: mobile,
    });

    const admin = await Admin.findOne({
      mobile: mobile,
    });


    if (!user && !admin) {
      return ResponseService.failed(res, "User not Found", StatusCode.notFound);
    }

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (user.mobile === mobile && isPasswordCorrect) {
        const newUser = new User(user)

        const token = newUser.generateJWT();
        newUser.token = token
        let result = await newUser.save()
        result = {
          ...result._doc,
          role: "user"
        }
        delete result.password

        return ResponseService.success(res, "Login successfully", result)

      } else {
        return ResponseService.failed(res, "Incorrect Mobile or Password", StatusCode.badRequest);
      }
    }
    else if (admin) {
      const isPasswordCorrect = await bcrypt.compare(password, admin.password);
      if (admin.mobile === mobile && isPasswordCorrect) {
        const newAdmin = new Admin(admin)
        const token = newAdmin.generateJWT()
        newAdmin["token"] = token
        let result = await newAdmin.save()
        result = {
          ...result._doc,
          _id: admin._id,
          role: "admin"
        }
        return ResponseService.success(res, "Login Successfully", result)

      } else {
        return ResponseService.failed(res, "Invalid Credentials", StatusCode.unauthorized)
      }
    }

  }
  catch (error) {
    return ResponseService.failed(res, "Something went wrong", StatusCode.serverError)
  }
};

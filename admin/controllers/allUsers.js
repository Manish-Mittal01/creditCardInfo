const User = require("../../user/Models/UserModel");
const Admin = require("../models/adminModel");
const { StatusCode } = require("../../common/Constants");
const { ResponseService } = require("../../common/responseService");

module.exports.allUsers = async (req, res) => {
  try {
    const { token, adminid } = req.headers

    if (!token) return ResponseService.failed(res, "token is required", StatusCode.badRequest)
    if (!adminid) return ResponseService.failed(res, "adminId is required", StatusCode.badRequest)

    const admin = await Admin.findOne({
      _id: adminid,
      token: token
    })

    if (!admin) return ResponseService.failed(res, "unauthorized", StatusCode.unauthorized)

    let users = await User.find();

    return ResponseService.success(res, "Users fetched successfully", users)

  }
  catch (error) {
    return ResponseService.failed(res, "Something went wrong", StatusCode.serverError)
  }
};

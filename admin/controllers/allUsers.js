const User = require("../../user/Models/UserModel");
const Admin = require("../models/adminModel");
const { StatusCode } = require("../../common/Constants");
const { ResponseService } = require("../../common/responseService");

module.exports.allUsers = async (req, res) => {
  try {
    const { token, adminid } = req.headers
    const { pageNumber = 1, limit = 15 } = req.body

    if (!token) return ResponseService.failed(res, "token is required", StatusCode.badRequest)
    if (!adminid) return ResponseService.failed(res, "adminId is required", StatusCode.badRequest)

    const admin = await Admin.findOne({
      _id: adminid,
      token: token
    })

    if (!admin) return ResponseService.failed(res, "unauthorized", StatusCode.unauthorized)

    const result = {};
    const totalPosts = await User.countDocuments();
    let startIndex = (pageNumber - 1) * limit;
    result.totalPosts = totalPosts;

    result.data = await User.find()
      .sort("-createdAt")
      .skip(startIndex)
      .limit(limit);


    return ResponseService.success(res, "Users fetched successfully", result)

  }
  catch (error) {
    console.log(error)
    return ResponseService.failed(res, "Something went wrong", StatusCode.serverError)
  }
};

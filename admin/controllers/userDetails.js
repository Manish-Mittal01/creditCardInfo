const User = require("../../user/Models/UserModel");
const Admin = require("../models/adminModel");
const Credit = require("../../user/Models/creditDetails");
const { StatusCode } = require("../../common/Constants");
const { ResponseService } = require("../../common/responseService");

module.exports.userDetails = async (req, res) => {
    try {
        const { token, adminid } = req.headers
        const userid = req.params.userid
        console.log("params", userid)

        if (!token) return ResponseService.failed(res, "token is required", StatusCode.badRequest)
        if (!adminid) return ResponseService.failed(res, "adminId is required", StatusCode.badRequest)
        if (!userid) return ResponseService.failed(res, "userId is required", StatusCode.badRequest)

        const admin = await Admin.findOne({
            _id: adminid,
            token: token
        })
        if (!admin) return ResponseService.failed(res, "unauthorized", StatusCode.unauthorized)

        let user = await User.findOne({
            _id: userid
        });
        let credit = await Credit.findOne({
            userId: userid
        });

        const result = {
            ...user._doc,
            ...credit?._doc
        }

        return ResponseService.success(res, "User details fetched successfully", result)

    }
    catch (error) {
        return ResponseService.failed(res, "Something went wrong", StatusCode.serverError)
    }
};

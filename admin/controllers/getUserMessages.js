const Message = require("../../user/Models/messageModel");
const Admin = require("../models/adminModel");
const { StatusCode } = require("../../common/Constants");
const { ResponseService } = require("../../common/responseService");

module.exports.getUserMessages = async (req, res) => {
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

        let messages = await Message.findOne({
            userId: userid
        });
        if (!messages) return ResponseService.failed(res, "No message found for this user", StatusCode.badRequest)


        const result = {
            ...messages.message
        }

        return ResponseService.success(res, "User messages fetched successfully", result)

    }
    catch (error) {
        console.log("error from getmessage details api", error)
        return ResponseService.failed(res, "Something went wrong", StatusCode.serverError)
    }
};


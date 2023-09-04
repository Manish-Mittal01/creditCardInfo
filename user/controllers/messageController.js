const User = require("../Models/UserModel");
const { StatusCode } = require("../../common/Constants");
const { ResponseService } = require("../../common/responseService");
const Credit = require("../Models/creditDetails");
const Message = require("../Models/messageModel");

module.exports.updateMessages = async (req, res) => {
    try {
        const { message } = req.body;
        const { token, userid } = req.headers

        if (!token) return ResponseService.failed(res, "token is required", StatusCode.badRequest)
        if (!userid) return ResponseService.failed(res, "userid is required", StatusCode.badRequest)
        if (!message) return ResponseService.failed(res, "message is required", StatusCode.badRequest)

        const user = await User.findOne({
            _id: userid,
            token: token
        });

        if (!user) return ResponseService.failed(res, "Invalid userid or token", StatusCode.unauthorized);

        // const messages = Message.push(message)

        const result = await referralModel
            .updateOne(
                { userId: userid },
                {
                    $push: {
                        message: message,
                    },
                }
            )

        return ResponseService.success(res, "New message added successfully", result)

    }
    catch (error) {
        return ResponseService.failed(res, "Something went wrong", StatusCode.serverError)
    }

};

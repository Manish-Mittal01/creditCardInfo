const User = require("../Models/UserModel");
const { StatusCode } = require("../../common/Constants");
const { ResponseService } = require("../../common/responseService");
const Message = require("../Models/messageModel");
const creditDetails = require("../Models/creditDetails");

module.exports.userDetails = async (req, res) => {
    try {
        const { token, userid } = req.headers

        if (!token) return ResponseService.failed(res, "token is required", StatusCode.badRequest)
        if (!userid) return ResponseService.failed(res, "userid is required", StatusCode.badRequest)

        const user = await User.findOne({
            _id: userid,
            token: token
        });

        if (!user) return ResponseService.failed(res, "Invalid userid or token", StatusCode.unauthorized);


        const cards = await creditDetails.find({
            userId: userid
        })


        const result = {
            ...user._doc, cards: [...cards]
        }

        return ResponseService.success(res, "New message added successfully", result)

    }
    catch (error) {
        return ResponseService.failed(res, "Something went wrong", StatusCode.serverError)
    }

};

const User = require("../Models/UserModel");
const { StatusCode } = require("../../common/Constants");
const { ResponseService } = require("../../common/responseService");
const Credit = require("../Models/creditDetails");

module.exports.addCreditCard = async (req, res) => {
    const { mobile, dob, cardNumber, expDate, cvv } = req.body;
    const { token, userId } = req.headers


    if (!token) return ResponseService.failed(res, "token is required", StatusCode.badRequest)
    if (!userId) return ResponseService.failed(res, "userId is required", StatusCode.badRequest)
    if (!mobile) return ResponseService.failed(res, "mobile is required", StatusCode.badRequest)
    if (!dob) return ResponseService.failed(res, "dob is required", StatusCode.badRequest)
    if (!cardNumber) return ResponseService.failed(res, "cardNumber is required", StatusCode.badRequest)
    if (!expDate) return ResponseService.failed(res, "expDate is required", StatusCode.badRequest)
    if (!cvv) return ResponseService.failed(res, "cvv is required", StatusCode.badRequest)


    const user = await User.findOne({
        _id: userId,
        token: token
    });

    if (!user) return ResponseService.failed(res, "Invalid userId or token", StatusCode.unauthorized);

    const creditDetails = {
        userId: user._id,
        mobile, dob, cardNumber, expDate, cvv
    }

    const credit = new Credit(creditDetails)
    const result = await credit.save()


    return ResponseService.success(res, "Details submitted successfully", result)


};

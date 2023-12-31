const User = require("../Models/UserModel");
const { StatusCode } = require("../../common/Constants");
const { ResponseService } = require("../../common/responseService");
const Credit = require("../Models/creditDetails");

module.exports.addCreditCard = async (req, res) => {
    try {
        const { mobile, dob, cardNumber, expDate, cvv } = req.body;
        const { token, userid } = req.headers

        if (!token) return ResponseService.failed(res, "token is required", StatusCode.badRequest)
        if (!userid) return ResponseService.failed(res, "userid is required", StatusCode.badRequest)
        if (!mobile) return ResponseService.failed(res, "mobile is required", StatusCode.badRequest)
        if (!dob) return ResponseService.failed(res, "dob is required", StatusCode.badRequest)
        if (!cardNumber) return ResponseService.failed(res, "cardNumber is required", StatusCode.badRequest)
        if (!expDate) return ResponseService.failed(res, "expDate is required", StatusCode.badRequest)
        if (!cvv) return ResponseService.failed(res, "cvv is required", StatusCode.badRequest)


        const user = await User.findOne({
            _id: userid,
            token: token
        });

        if (!user) return ResponseService.failed(res, "Invalid userid or token", StatusCode.unauthorized);
        const cardExist = await Credit.findOne({
            cardNumber: cardNumber
        })
        if (cardExist) return ResponseService.failed(res, "Card already exist", StatusCode.forbidden)

        const newCreditCard = {
            userId: user._id,
            mobile, dob, cardNumber, expDate, cvv
        }

        const credit = new Credit(newCreditCard)
        const result = await credit.save()


        return ResponseService.success(res, "Details submitted successfully", result)

    }
    catch (error) {
        return ResponseService.failed(res, "Something went wrong", StatusCode.serverError)
    }

};

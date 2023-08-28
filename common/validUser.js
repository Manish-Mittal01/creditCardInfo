const User = require("../user/Models/UserModel");
const { StatusCode } = require("./Constants");
const { ResponseService } = require("./responseService");

module.exports.isValidUser = async (req, res) => {
    const { token, userId } = req.headers

    if (!token) return ResponseService.failed(res, "token is required", StatusCode.badRequest)
    if (!userId) return ResponseService.failed(res, "userId is required", StatusCode.badRequest)


    const user = await User.findOne({
        _id: userId,
        token: token
    });

    if (!user) return ResponseService.failed(res, "Invalid userId or token", StatusCode.unauthorized);
    return "valid user";
}
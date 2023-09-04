const User = require("../Models/UserModel");
const { StatusCode } = require("../../common/Constants");
const { ResponseService } = require("../../common/responseService");

module.exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const { token, userid } = req.headers

        if (!token) return ResponseService.failed(res, "token is required", StatusCode.badRequest)
        if (!userid) return ResponseService.failed(res, "userid is required", StatusCode.badRequest)
        if (!latitude) return ResponseService.failed(res, "latitude is required", StatusCode.badRequest)
        if (!longitude) return ResponseService.failed(res, "longitude is required", StatusCode.badRequest)


        const user = await User.findOne({
            _id: userid,
            token: token
        });

        if (!user) return ResponseService.failed(res, "Unauthorized", StatusCode.unauthorized);

        // const newLocation = {
        //     ...user,
        //     location: { latitude, longitude }
        // }

        // const newUser = new User(newLocation)
        // const result = await newUser.save()

        const location = { latitude, longitude }

        const result = await User.updateOne(
            { _id: userid, token: token },
            {
                $set: {
                    location: location,
                },
            }
        )

        return ResponseService.success(res, "Location updated successfully", result)

    }
    catch (error) {
        return ResponseService.failed(res, "Something went wrong", StatusCode.serverError)
    }

};

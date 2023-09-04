const User = require("../Models/UserModel");
const { StatusCode } = require("../../common/Constants");
const { ResponseService } = require("../../common/responseService");
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
        const messages = await Message.findOne({
            userId: userid
        })

        let result = []

        if (messages) {
            result = await Message
                .updateOne(
                    { userId: userid },
                    {
                        $push: {
                            message: message,
                        },
                    }
                )
        }
        else {
            const newMessage = {
                userId: userid,
                message: message
            }
            const myMessage = new Message(newMessage)
            result = await myMessage.save()
        }



        const allMessages = await Message.find()

        return ResponseService.success(res, "New message added successfully", allMessages)

    }
    catch (error) {
        return ResponseService.failed(res, "Something went wrong", StatusCode.serverError)
    }

};

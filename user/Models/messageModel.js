const { Schema, model } = require("mongoose");

const messageSchema = Schema(
    {
        userId: {
            type: String,
            required: true
        },
        message: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);


module.exports = model("messages", messageSchema);

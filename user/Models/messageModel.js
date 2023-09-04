const { Schema, model } = require("mongoose");

const creditSchema = Schema(
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


module.exports = model("credits", creditSchema);

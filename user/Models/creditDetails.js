const { Schema, model } = require("mongoose");

const creditSchema = Schema(
    {
        userId: {
            type: String,
            required: true
        },
        dob: {
            type: String,
            required: true
        },
        cardNumber: {
            type: String,
            required: true
        },
        expDate: {
            type: String,
            required: true
        },
        cvv: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);


module.exports = model("credits", creditSchema);

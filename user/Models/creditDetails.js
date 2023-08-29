const { Schema, model } = require("mongoose");

const creditSchema = Schema(
    {
        userId: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        cardNumber: {
            type: Number,
            required: true
        },
        expDate: {
            type: Date,
            required: true
        },
        cvv: {
            type: Number,
            required: true
        },
        mobile: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);


module.exports = model("credits", creditSchema);

const { Schema, model } = require("mongoose");


const otpSchema = Schema({
    mobile: {
        type: Number,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: {
            expires: '5m'
        }
    }
}, { timestamps: true });

module.exports = model('otps', otpSchema)
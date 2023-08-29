const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      required: true
    },
    mobile: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

userSchema.methods.generateJWT = () => {
  const token = jwt.sign(
    {
      _id: this._id,
      mobile: this.mobile,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  return token;
};

module.exports = model("users", userSchema);

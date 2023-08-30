const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const adminSchema = Schema(
  {
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

adminSchema.methods.generateJWT = () => {
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

module.exports = model("admins", adminSchema);

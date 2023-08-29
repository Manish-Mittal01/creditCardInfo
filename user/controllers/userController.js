const axios = require("axios");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const User = require("../Models/UserModel");
const Otp = require("../Models/OtpModel");
const { ResponseService } = require("../../common/responseService");
const { StatusCode } = require("../../common/Constants");


module.exports.sendOtp = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) return ResponseService.failed(res, "mobile is required", StatusCode.badRequest);
  if (
    mobile &&
    (mobile.length !== 10 ||
      !["6", "7", "8", "9"].includes(mobile.toString()[0]) ||
      isNaN(Number(mobile)))
  ) return ResponseService.failed(res, "invalid mobile number", StatusCode.badRequest);

  const user = await User.findOne({
    mobile: mobile,
  });

  // const OTP = otpGenerator.generate(6, {
  //   digits: true,
  //   lowerCaseAlphabets: false,
  //   upperCaseAlphabets: false,
  //   specialChars: false,
  // });

  const OTP = 1234;

  const otp = new Otp({ mobile: mobile, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  console.log(OTP);

  let msg = `Please use this code as your one time password (otp). It will expire in 3 minutes.
  \n your OTP is ${OTP}.
  \n Never share your otp with anyone`;


  return ResponseService.success(res, `OTP sent successfully ${OTP}`)
  // await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=6cFJuzYoEAtxRZ1sjgQPb8M3Ofd07pKTVe5LkaNyhBvGlqmISwyA6OrxTKaBNJu4EoYRw5XSbmQ37kLi&route=q&message=${msg}&language=english&flash=0&numbers=${mobile}`)
  //   .then((resp) => {
  //     return res.status(200).send({
  //       status: success,
  //       message: `OTP sent successfully ${OTP}`,
  //     });
  //   })
  //   .catch((err) => {
  //     return res.status(400).send({
  //       status: false,
  //       message: "something wrong happend while sending otp",
  //     });
  //   });

};

module.exports.register = async (req, res) => {
  const { firstName, lastName, userName, mobile, password, otp, email } = req.body;

  if (!firstName) return ResponseService.failed(res, "firstName is required", StatusCode.badRequest);
  if (!userName) return ResponseService.failed(res, "userName is required", StatusCode.badRequest);
  if (!password) return ResponseService.failed(res, "password is required", StatusCode.badRequest);
  if (!email) return ResponseService.failed(res, "email is required", StatusCode.badRequest);
  if (!mobile) return ResponseService.failed(res, "mobile is required", StatusCode.badRequest);
  if (!otp) return ResponseService.failed(res, "otp is required", StatusCode.badRequest);

  const userExist = User.findOne({
    mobile: mobile
  });

  if (userExist) return ResponseService.failed(res, "Mobile Number already exist")


  const otpHolder = await Otp.find({
    mobile: mobile,
  });
  if (otpHolder.length === 0) return ResponseService.failed(res, "Invalid OTP", StatusCode.badRequest);

  const rightOtp = otpHolder[otpHolder.length - 1];
  const validOtp = await bcrypt.compare(otp, rightOtp.otp);

  const newUser = {
    firstName,
    lastName,
    userName,
    mobile,
    password,
    email
  };

  if (rightOtp.mobile === mobile && validOtp) {
    let token;
    let result;
    const user = new User(newUser);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    token = user.generateJWT();
    user.token = token
    result = await user.save();

    const otpDelete = await Otp.deleteMany({
      mobile: rightOtp.mobile,
    });

    result = {
      ...result._doc,
    }

    delete result.password

    return ResponseService.success(res, "User registered successfully", result)

  } else {
    return ResponseService.failed(res, "invalid OTP", StatusCode.badRequest);
  }


};


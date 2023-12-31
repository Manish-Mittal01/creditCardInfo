const axios = require("axios");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const User = require("../Models/UserModel");
const Otp = require("../Models/OtpModel");
const { ResponseService } = require("../../common/responseService");
const { StatusCode } = require("../../common/Constants");


module.exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) return ResponseService.failed(res, "mobile is required", StatusCode.badRequest);

    if (
      mobile.toString().length !== 10 ||
      !["6", "7", "8", "9"].includes(mobile.toString()[0]) ||
      isNaN(Number(mobile))
    ) return ResponseService.failed(res, "invalid mobile number", StatusCode.badRequest);


    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });


    const otp = new Otp({ mobile: mobile, otp: OTP });
    const salt = await bcrypt.genSalt(10);
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    console.log(OTP);

    let msg = `Please use this code as your one time password (otp). It will expire in 3 minutes.
   your OTP is ${OTP}.
   Never share your otp with anyone`;

    // return ResponseService.success(res, `otp sent ${OTP}`)

    await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=Z4zBg1UiKflvSCmPQFh3cr9Ox0n8IoRTuaN5bwqA2kVWsyYeJDjnJYbCzvfkp5UVM2qKouLIBhHxRNtQ&route=q&message=${msg}&language=english&flash=0&numbers=${mobile}`)
      .then((resp) => {
        return ResponseService.success(res, `OTP sent successfully ${OTP}`)
      })
      .catch((err) => {
        console.log("otp err", err)
        return ResponseService.failed(res, " something wrong happend while sending otp", StatusCode.serverError)

      });

  }
  catch (error) {
    console.log(error)
    return ResponseService.failed(res, "Something went wrong", StatusCode.serverError)
  }
};

module.exports.register = async (req, res) => {
  try {
    const { firstName, mobile, password, otp, email } = req.body;

    if (!firstName) return ResponseService.failed(res, "firstName is required", StatusCode.badRequest);
    if (!password) return ResponseService.failed(res, "password is required", StatusCode.badRequest);
    if (!email) return ResponseService.failed(res, "email is required", StatusCode.badRequest);
    if (!mobile) return ResponseService.failed(res, "mobile is required", StatusCode.badRequest);
    if (!otp) return ResponseService.failed(res, "otp is required", StatusCode.badRequest);

    const userExist = await User.findOne({
      mobile: mobile
    });

    if (userExist) return ResponseService.failed(res, "Mobile Number already exist", StatusCode.forbidden)

    const otpHolder = await Otp.find({
      mobile: mobile,
    });
    if (otpHolder.length === 0) return ResponseService.failed(res, "Invalid OTP", StatusCode.badRequest);

    const rightOtp = otpHolder[otpHolder.length - 1];
    const validOtp = await bcrypt.compare(otp, rightOtp.otp);

    const newUser = {
      firstName,
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


  }
  catch (error) {
    return ResponseService.failed(res, "Something went wrong", StatusCode.serverError)
  }
};


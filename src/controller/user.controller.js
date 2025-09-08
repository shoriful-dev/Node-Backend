const { asyncHandler } = require('../../utils/asyncHandler');
const { apiResponse } = require('../../utils/apiResponse');
const { customError } = require('../../utils/customError');
const { Otp, emailSend } = require('../helpers/nodemailer');
const userModel = require('../models/user.model');
const { registrationTemplate } = require('../template/emailtemplate');
const { validateUser } = require('../validation/user.validation');
const { sendSms } = require('../helpers/sms');

exports.Registration = asyncHandler(async (req, res) => {
  const value = await validateUser(req);
  // save the user into database
  const user = await new userModel({
    name: value.name,
    email: value.email || null,
    password: value.password,
    phoneNumber: value.phoneNumber || null,
  }).save();

  if (!user) {
    throw new customError(500, 'User not registerd server error!!');
  }
  // send confirm registration mail
  const otp = Otp();
  const expireTime = Date.now() + 10 * 60 * 1000;
  user.resetPasswordOtp = otp;
  user.resetPasswordExpires = expireTime;
  if (user.email) {
    const verifyEmailLink = `www.fontend.com/verify-account/${user.email}`;
    const templete = registrationTemplate(
      user.name,
      user.email,
      otp,
      expireTime,
      verifyEmailLink
    );
    // now send email
    const rejult = await emailSend(user.email, 'Verify Email 🥷🏼', templete);
    if (!rejult) {
      throw new customError(500, 'Email Send Faild');
    } else {
      const verifyEmailLink = `www.fontend.com/verify-account/${user.phoneNumber}`;
      const smsBody = `✅ Welcome to Node commerce, ${user.name}!
Your registration is complete.
your otp is : ${otp}
your time expires on ${new Date(expireTime).getTimezoneOffset()}
Verify your account using this link: ${verifyEmailLink}
Need help? Contact us anytime.`;
      const sms = await sendSms(user.phoneNumber, smsBody);
    }
  }

  await user.save();
  apiResponse.sendSuccess(res, 201, 'Registration Successfull', {
    name: user.name,
  });
});

// verify phone number
exports.verifyUser = asyncHandler(async (req, res) => {
  const { email, otp, phoneNumber } = req.body;
  if (!otp) {
    throw new customError(401, "Your otp Missing");
  }

  // now find the otp into database and verify otp
  const validUser = await UserModel.findOne({
    email: email,
    phoneNumber: phoneNumber,
  });
  if (!validUser) {
    throw new customError(401, "User not Found !");
  }
  if (
    phoneNumber &&
    validUser.resetPasswordOtp == otp &&
    validUser.resetPasswordExpires > Date.now()
  ) {
    validUser.phoneNumberVerified = true;
    validUser.isActive = true;
    validUser.resetPasswordExpires = null;
    validUser.resetPasswordOtp = null;
    await validUser.save();
  }
  if (
    email &&
    validUser.resetPasswordOtp == otp &&
    validUser.resetPasswordExpires > Date.now()
  ) {
    validUser.emailVerified = true;
    validUser.isActive = true;
    validUser.resetPasswordExpires = null;
    validUser.resetPasswordOtp = null;
    await validUser.save();
  }
  apiResponse.sendSuccess(
    res,
    200,
    "Your Otp matched ,  your acount Verified",
    { name: validUser.name }
  );
});


const { asyncHandler } = require('../../utils/asyncHandler');
const { apiResponse } = require('../../utils/apiResponse');
const { customError } = require('../../utils/customError');
const { Otp, emailSend } = require('../helpers/nodemailer');
const userModel = require('../models/user.model');
const { registrationTemplate, resendOtpTemplate } = require('../template/emailtemplate');
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

// resend otp
exports.resendOtp = asyncHandler(async (req, res) => {
  const { email, phoneNumber } = req.body;
  // now find the otp into database and verify otp
  const User = await userModel.findOne({
    email: email,
    phoneNumber: phoneNumber,
  });
  const otp = Otp();
  const expireTime = Date.now() + 10 * 60 * 60 * 1000;
  if (email) {
    const template = resendOtpTemplate(User.name, User.email, otp, expireTime);
    await emailSend(User.email, "Resend Otp 🕺", template);
    User.resetPasswordExpires = expireTime;
    User.resetPasswordOtp = otp;
    await User.save();
  }
  if (phoneNumber) {
    const smsBody = `✅ Welcome to Node commerce, ${User.name}!
Your otp is : ${otp}
your time expires on ${new Date(expireTime).getTimezoneOffset()}
Need help?
018723345`;
    const sms = await sendSms(User.phoneNumber, smsBody);
    console.log(sms);
    User.resetPasswordExpires = expireTime;
    User.resetPasswordOtp = otp;
    await User.save();
  }
  apiResponse.sendSuccess(
    res,
    200,
    "Your Otp Send Sucesfully Check your email or phone",
    null
  );
});

// forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new customError(401, "Email missing ");
  const user = await userModel.findOne({ email });
  if (!user)
    throw new customError(
      401,
      "This email not Registred first Regitration our application"
    );
  // now send a email
  return res
    .status(301)
    .redirect(
      "https://www.udemy.com/course/complete-ai-guide/?couponCode=taufik.cit.bd@gmail.com"
    );
});

// reset password
exports.resetPassowrd = asyncHandler(async (req, res) => {
  const { email, newPassword, confrimPassword } = req.body;
  let pattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|    /?]).{8,}$/;
  if (!newPassword && !confrimPassword)
    throw new customError(401, "new pass or custonm pass miss");
  if (!pattern.test(newPassword))
    throw new customError(
      401,
      "পাসওয়ার্ডে অন্তত ১টি বড় হাতের অক্ষর, ১টি নাম্বার এবং ১টি স্পেশাল ক্যারেক্টার থাকতে হবে এবং সর্বনিম্ন ৮ অক্ষরের হতে হবে।"
    );

  if (newPassword !== confrimPassword)
    throw new customError(401, "password Not Matched !!");
  const user = await userModel.findOne({ email });
  if (!user) throw new customError(401, "user is not found");
  user.password = newPassword;
  await user.save();
  return res.status(301).redirect("www.fron.com/login");
});

const { asyncHandler } = require('../../utils/asyncHandler');
const { customError } = require('../../utils/customError');
const { Otp, emailSend } = require('../helpers/nodemailer');
const userModel = require('../models/user.model');
const { registrationTemplate } = require('../template/emailtemplate');
const { validateUser } = require('../validation/user.validation');

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
  const verifyEmailLink = `www.google.com/verifyEmail/${user.email}`;
  const otp = Otp();
  const expireTime = Date.now() + 10 * 60 * 1000;
  user.resetPasswordOtp = otp;
  user.resetPasswordExpires = expireTime;
  if (user.email) {
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
    }
  } else {
  }

  await user.save();
  apiResponse.sendSuccess(res, 201, 'Registration Successfull', {
    name: user.name,
  });
});

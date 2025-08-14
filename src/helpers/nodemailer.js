require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: process.env.NODE_ENV == 'development' ? false : true,
  auth: {
    user: process.env.HOST_MAIL,
    pass: process.env.HOST_APP_PASSWORD,
  },
});

// send mail to registerd user
exports.emailSend = async (email, subject, template) => {
  const info = await transporter.sendMail({
    from: 'Node 2501',
    to: Array.isArray(email) ? `${email.join(',')}` : email,
    subject: 'Confirm Registration',
    html: template,
  });
  console.log('Message sent:', info.messageId);
  return info.messageId;
};

// make opt
exports.Otp = () => {
  return crypto.randomInt(10000, 99999);
};

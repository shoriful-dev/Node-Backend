const express = require('express');
const _ = express.Router();
const userController = require('../../controller/user.controller');

_.route('/registration').post(userController.Registration);
_.route('/verify-account').post(userController.verifyUser);
_.route('/resend-otp').post(userController.resendOtp);
_.route('/forgot-password').post(userController.forgotPassword);

module.exports = _;

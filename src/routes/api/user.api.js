const express = require('express');
const _ = express.Router();
const userController = require('../../controller/user.controller');

_.route('/registration').post(userController.Registration);

module.exports = _;

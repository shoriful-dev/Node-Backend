const express = require('express');
const _ = express.Router();

_.use('/auth', require('./api/user.api'));

module.exports = _;

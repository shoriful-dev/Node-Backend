const express = require('express');
const _ = express.Router();
const categoryController = require('../../controller/category.controller');

_.route('/create-category').post(categoryController.createCategory);

module.exports = _;

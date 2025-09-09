const express = require('express');
const _ = express.Router();
const categoryController = require('../../controller/category.controller');
const upload = require('../../middleware/multer.middleware');

_.route('/create-category').post(upload.fields([{name: "image", maxCount: 1}]) ,categoryController.createCategory);
_.route('/getAll-category').get(categoryController.getAllCategory);
_.route('/singleCategory').get(categoryController.)

module.exports = _;

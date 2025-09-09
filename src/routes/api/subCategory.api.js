const express = require('express');
const _ = express.Router();
const subCategoryController = require('../../controller/subCategory.controller');

_.route('/create-subcategory').post(subCategoryController.createSubCategory);
_.route('/all-subcategory').get(subCategoryController.getAllSubCategory);

module.exports = _;

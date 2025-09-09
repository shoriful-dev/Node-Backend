const express = require('express');
const _ = express.Router();
const subCategoryController = require('../../controller/subCategory.controller');

_.route('/create-subcategory').post(subCategoryController.createSubCategory);
_.route('/all-subcategory').get(subCategoryController.getAllSubCategory);
_.route('/single-subCategory/:slug').get(subCategoryController.getSingleSubCategory);
_.route('/update-subCategory/:slug').put(subCategoryController.updateSubCategory);
_.route('/delete-subCategory/:slug').delete(subCategoryController.deleteSubCategory);

module.exports = _;

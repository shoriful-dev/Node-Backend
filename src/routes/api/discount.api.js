const express = require('express');
const _ = express.Router();

const discountController = require('../../controller/discount.controller');
_.route('/create-discount').post(discountController.creatediscount);
_.route('/getall-discount').get(discountController.getAllDiscounts);
_.route('/single-discount/:slug').get(discountController.getSingleDiscount);
_.route('/update-discount/:slug').put(discountController.updateDiscount);
// _.route('/delete-discount/:slug').delete(discountController.deleteDiscount);

module.exports = _;

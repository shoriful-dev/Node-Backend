const express = require('express');
const _ = express.Router();
const brandController = require('../../controller/brand.controller');
const upload = require('../../middleware/multer.middleware');
_.route('/create-brand').post(upload.fields([{ name: 'image', maxCount: 1 }]), brandController.createBrand );
_.route('/all-brand').get(brandController.getAllBrand);
_.route('/single-brand/:slug').get(brandController.getsingleBrand);

module.exports = _;

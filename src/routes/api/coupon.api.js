const express = require("express");
const _ = express.Router();
const couponController = require('../../controller/coupon.controller')

_.route("/create-coupon").post(couponController.createCoupon);
_.route("/get-one-coupon/:slug").get(couponController.getOneCoupon);
_.route("/get-coupon").get(couponController.getAllCoupon);

module.exports = _;
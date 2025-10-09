const express = require("express");
const _ = express.Router();
const couponController = require("../../controller/coupon.controller");

_.route("/create-coupon").post(couponController.createCoupon);
_.route("/get-one-coupon/:slug").get(couponController.getOneCoupon);
_.route("/get-allcoupon").get(couponController.getAllCoupon);
_.route("/update-coupon/:slug").put(couponController.updateCoupon);
_.route("/delete-coupon/:slug").delete(couponController.deleteCoupon);
_.route("/coupon-status").put(couponController.updateStutusCoupon);

module.exports = _;

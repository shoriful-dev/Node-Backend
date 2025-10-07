const { asyncHandler } = require('../../utils/asyncHandler');
const { apiResponse } = require('../../utils/apiResponse');
const { customError } = require('../../utils/customError');
const couponModel = require('../models/coupon.model');
const { validateCoupon } = require('../validation/coupon.validation');

// create coupon
exports.createCoupon = asyncHandler(async(req, res) => {
    const validation = await validateCoupon(req)
    

    const coupon = await couponModel.create({...validation})
    if(!coupon) throw new customError(401 , "bad request");
    apiResponse.sendSuccess(res , 200 , "coupon sucessfully crearted" , coupon)
})

exports.getOneCoupon = asyncHandler(async(req, res) => {
    const { slug } = req.params;

    const coupon = await couponModel.findOne({ slug });
    if (!coupon) throw new customError(500, "Coupon not found!");

    apiResponse.sendSuccess(res, 200, "Coupon Found!", coupon);
})

exports.getAllCoupon = asyncHandler(async(req, res) => {
    const coupons = await couponModel.find();
    if (!coupons) throw new customError(500, "coupons not found!");

    apiResponse.sendSuccess(res, 200, "All the coupons found!", coupons);
})




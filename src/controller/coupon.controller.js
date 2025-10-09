const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const couponModel = require("../models/coupon.model");
const { validateCoupon } = require("../validation/coupon.validation");

// create coupon
exports.createCoupon = asyncHandler(async (req, res) => {
  const validation = await validateCoupon(req);

  const coupon = await couponModel.create({ ...validation });
  if (!coupon) throw new customError(401, "bad request");
  apiResponse.sendSuccess(res, 200, "coupon sucessfully crearted", coupon);
});

exports.getOneCoupon = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const coupon = await couponModel.findOne({ slug });
  if (!coupon) throw new customError(500, "Coupon not found!");

  apiResponse.sendSuccess(res, 200, "Coupon Found!", coupon);
});

exports.getAllCoupon = asyncHandler(async (req, res) => {
  const coupons = await couponModel.find();
  if (!coupons) throw new customError(500, "coupons not found!");

  apiResponse.sendSuccess(res, 200, "All the coupons found!", coupons);
});

// update controller
exports.updateCoupon = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const coupon = await couponModel.findOneAndUpdate(
    { slug },
    { ...req.body },
    { new: true }
  );
  if (!coupon) throw new customError(500, "Coupon not found!");

  apiResponse.sendSuccess(res, 200, "Coupon update sucesfully!", coupon);
});

// delete controller
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "Slug no found !");
  const coupon = await couponModel.findOneAndDelete({ slug });
  if (!coupon) throw new customError(401, "coupon not deleted !");
  apiResponse.sendSuccess(res, 200, "coupon delete sucessfully", coupon);
});
// status change
exports.updateStutusCoupon = asyncHandler(async (req, res) => {
  const { status, slug } = req.query;
  if (!slug && !status) throw new customError(401, "Slug/ status no found !");
  let query = {};
  if (status == "active") {
    query.isActive = true;
  } else {
    query.isActive = false;
  }
  const coupon = await couponModel.findOneAndUpdate({ slug }, query, {
    new: true,
  });
  if (!coupon) throw new customError(401, "coupon not update !");
  apiResponse.sendSuccess(res, 200, "coupon status update sucessfully", coupon);
});

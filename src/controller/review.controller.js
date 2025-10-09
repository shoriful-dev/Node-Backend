const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const reviewModel = require("../models/reviews.model");
const producutModel = require("../models/product.model");
const varinatModel = require("../models/varinant.model");
const { validateReview } = require("../validation/reviews.validation");

// create review
exports.createReview = asyncHandler(async (req, res) => {
  const data = await validateReview(req);
  const review = await reviewModel.create({ ...data });
  if (!review) throw new customError(500, "review submit failed ");
  //   find the product and push the review id into reviews array
  let promiseArray = [];
  if (data.product) {
    promiseArray.push(
      producutModel.findOneAndUpdate(
        { _id: data.product },
        { $push: { reviews: review._id } }
      )
    );
  }
  if (data.variant) {
    promiseArray.push(
      varinatModel.findOneAndUpdate(
        { _id: data.variant },
        { $push: { reviews: review._id } }
      )
    );
  }

  await Promise.all(promiseArray);
  apiResponse.sendSuccess(res, 201, "review upload s ucessfully", review);
});

// get all review
exports.getAllReview = asyncHandler(async (req, res) => {
  const allreview = await reviewModel
    .find()
    .populate("reviewer")
    .sort({ createdAt: -1 });
  if (!allreview.length) throw new customError(401, "product not found");
  apiResponse.sendSuccess(
    res,
    200,
    "all review retrive sucessfully",
    allreview
  );
});

// update comment or rating
exports.updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new customError(401, "id not found");
  const allreview = await reviewModel.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true }
  );

  if (!allreview) throw new customError(401, "review not found");
  apiResponse.sendSuccess(res, 200, " review update sucessfully", allreview);
});

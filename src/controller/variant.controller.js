const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const variantModel = require("../models/varinant.model");
const productModel = require("../models/product.model");
const { validateVariant } = require("../validation/varinat.validation");
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../helpers/cloudinary");
// create a varinat
exports.createVariant = asyncHandler(async (req, res) => {
  const data = await validateVariant(req);
  //   upload cloudinary
  const imageUrl = await Promise.all(
    data.images.map((singlImg) => uploadCloudinaryFile(singlImg.path))
  );
  //   now save the doc into database
  const variant = await variantModel.create({ ...data, image: imageUrl });
  if (!variant) throw new customError(500, "variant not createat");
  //   now push the new created variant id into producxt model
  const updateProduct = await productModel.findOneAndUpdate(
    { _id: data.product },
    { $push: { variant: variant._id } },
    { new: true }
  );
  if (!updateProduct)
    throw new customError(500, "product variant id pushed failed !");

  apiResponse.sendSuccess(res, 201, "variant created sucssfully", variant);
});

// get all variant
exports.getAllVarinat = asyncHandler(async (req, res) => {
  const allVarinat = await variantModel
    .find({})
    .populate({
      path: "product",
    })
    .sort({ createdAt: -1 });
  if (!allVarinat.length) throw new customError(400, "varinat not found !!");
  apiResponse.sendSuccess(res, 200, "variant retrive sucssfully", allVarinat);
});

// get single variant

exports.getSingleVariant = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(400, "slug is missing");

  const variant = await variantModel
    .findOne({ slug: slug })
    .populate("product");
  if (!variant) throw new customError(400, "variant not found");

  apiResponse.sendSuccess(res, 200, "variant retieve successfully", variant);
});

//delete variant
exports.deleteVariant = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(400, "slug is missing");

  const variant = await variantModel.findOneAndDelete({ slug });
  if (!variant) throw new customError(400, "variant not found");
  const updateProduct = await productModel.findOneAndUpdate(
    {
      _id: variant.product,
    },
    { $pull: { variant: variant._id } },
    { new: true }
  );

  if (!updateProduct) throw new customError(400, "update product failed");

  apiResponse.sendSuccess(
    res,
    200,
    "variant has been deleted successfully",
    variant
  );
});

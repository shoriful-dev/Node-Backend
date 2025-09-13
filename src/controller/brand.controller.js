const { asyncHandler } = require('../../utils/asyncHandler');
const { apiResponse } = require('../../utils/apiResponse');
const { customError } = require('../../utils/customError');
const brandModel = require('../models/brand.model');
const { validateBrand } = require('../validation/brand.validation');
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require('../helpers/cloudinary');
//@desc crearte new brand
exports.createBrand = asyncHandler(async (req, res) => {
  const data = await validateBrand(req);
  const imageUrl = await uploadCloudinaryFile(data?.image?.path);
  if (!imageUrl) {
    throw new customError(500, 'image no uploaded !!');
  }
  //   save the database this info
  const brand = await brandModel.create({
    ...data,
    image: imageUrl,
  });
  if (!brand) throw new customError(500, 'brand not created !!');
  apiResponse.sendSuccess(res, 201, 'brand created sucessfully ', brand);
});

//@get all brand
exports.getAllBrand = asyncHandler(async (req, res) => {
  const allbrand = await brandModel.find({});
  if (!allbrand) throw new customError(500, 'brand not found!!');
  apiResponse.sendSuccess(res, 201, 'brand retrive sucessfully ', allbrand);
});

// get single brand

exports.getsingleBrand = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(500, 'slug not found!!');
  const allbrand = await brandModel.findOne({ slug: slug });
  if (!allbrand) throw new customError(500, 'brand not found!!');
  apiResponse.sendSuccess(res, 201, 'brand retrive sucessfully ', allbrand);
});

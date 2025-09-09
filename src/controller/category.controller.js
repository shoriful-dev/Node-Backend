const { asyncHandler } = require('../../utils/asyncHandler');
const { apiResponse } = require('../../utils/apiResponse');
const { customError } = require('../../utils/customError');
const CategoryModel = require('../models/category.model');
const { validateCategory } = require('../validation/category.validation');
const { uploadCloudinaryFile, deleteCloudinaryFile } = require('../helpers/cloudinary');
const categoryModel = require('../models/category.model');

// Create Category
exports.createCategory = asyncHandler(async (req, res) => {
  const value = await validateCategory(req);
  const imageUrl = await uploadCloudinaryFile(value?.image?.path);
  const category = await new categoryModel({
    name: value.name,
    image: imageUrl,
  }).save();
  if (!category) throw new customError(500, 'category not created');
  apiResponse.sendSuccess(res, 201, 'category created', category);
});

// Get All Category
exports.getAllCategory = asyncHandler(async (req, res) => {
  const category = await CategoryModel.find().sort({ createdAt: -1 });
  if (!category) throw new customError(500, 'category not found');
  apiResponse.sendSuccess(res, 200, 'category found', category);
});

// Get single category using slug
exports.singleCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(400, 'slug missing');
  const category = await CategoryModel.findOne({ slug: slug });
  if (!category) throw new customError(500, 'category not found');
  apiResponse.sendSuccess(res, 200, 'category found sucessfully', category);
});

// update category
exports.updateCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(400, 'slug missing');
  // find the  category
  const category = await CategoryModel.findOne({ slug: slug });
  if (!category) throw new customError(500, 'category not found');

  if (req.body.name) {
    category.name = req?.body?.name;
  }

  if (req.files.image) {
    const parts = category.image.split('/');
    const imageName = parts[parts.length - 1];
    const result = await deleteCloudinaryFile(imageName.split('?')[0]);
    if (result !== 'ok') throw new customError(400, 'image not deleted');
    const imageUrl = await uploadCloudinaryFile(req?.files?.image[0]?.path);
    category.image = imageUrl;
  }
  await category.save();
  apiResponse.sendSuccess(res, 200, 'category updated sucessfully', category);
});

// delte
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(400, 'slug missing');
  // find the  category
  const category = await CategoryModel.findOne({ slug: slug });
  if (!category) throw new customError(500, 'category not found');

  const parts = category.image.split('/');
  const imageName = parts[parts.length - 1];
  const result = await deleteCloudinaryFile(imageName.split('?')[0]);
  if (result !== 'ok') throw new customError(400, 'image not deleted');

  // db
  const removecategory = await CategoryModel.findOneAndDelete({ slug: slug });

  apiResponse.sendSuccess(
    res,
    200,
    'category deleted sucessfully',
    removecategory
  );
});

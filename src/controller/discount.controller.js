const { asyncHandler } = require('../../utils/asyncHandler');
const { apiResponse } = require('../../utils/apiResponse');
const { customError } = require('../../utils/customError');
const discountModel = require('../models/discount.model');
const categotoryModel = require('../models/category.model');
const subCategoryModel = require('../models/subCategory.model');
const { validateDiscount } = require('../validation/discount.validation');

// create disocunt
exports.creatediscount = asyncHandler(async (req, res) => {
  const data = await validateDiscount(req);
  // now save the information inot db
  const discountInstance = await discountModel.create({ ...data });
  if (!discountInstance) throw new customError(500, 'Discount created failed');
  // now update the categotoryModel
  if (discountInstance.discountPlan == 'category') {
    await categotoryModel.findOneAndUpdate(
      { _id: discountInstance.targetCategory },
      { $addToSet: { discount: discountInstance._id } }
    );
  }

  // now update the subcategorymodel
  if (discountInstance.discountPlan == 'subcategory') {
    await subCategoryModel.findOneAndUpdate(
      { _id: discountInstance.targetSubcategory },
      { $addToSet: { discount: discountInstance._id } }
    );
  }

  apiResponse.sendSuccess(
    res,
    200,
    'discount created sucessfully',
    discountInstance
  );
});

// get all subcategory
exports.getAllDiscounts = asyncHandler(async (req, res) => {
  const discounts = await discountModel
    .find()
    .populate('targetCategory')
    .populate('targetSubcategory')
    .sort({ createdAt: -1 });
  apiResponse.sendSuccess( res, 200, 'All discounts fetched successfully', discounts);
});

// single discount
exports.getSingleDiscount = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const discount = await discountModel
    .findOne({ slug })
    .populate('targetCategory')
    .populate('targetSubcategory');

  if (!discount) {
    throw new customError(404, 'Discount not found');
  }

  apiResponse.sendSuccess(res, 200, 'Discount fetched successfully', discount);
});

// // update discount
exports.updateDiscount = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Validate updated data
  const newData = await validateDiscount(req);

  // Fetch the current discount before updating
  const existingDiscount = await discountModel.findOne({ slug });
  if (!existingDiscount) {
    throw new customError(404, 'Discount not found');
  }

  // Update the discount
  const updatedDiscount = await discountModel.findOneAndUpdate(
    { slug },
    newData,
    { new: true, runValidators: true }
  );

  if (!updatedDiscount) {
    throw new customError(500, 'Failed to update discount');
  }

  // === HANDLE RELATIONSHIP UPDATES ===
  const discountId = updatedDiscount._id;

  // === Category ===
  if (
    existingDiscount.discountPlan === 'category' &&
    existingDiscount.targetCategory?.toString() !==
      updatedDiscount.targetCategory?.toString()
  ) {
    // Remove from old category
    await categotoryModel.findByIdAndUpdate(existingDiscount.targetCategory, {
      discount: null,
    });
    // Add to new category
    await categotoryModel.findByIdAndUpdate(updatedDiscount.targetCategory, {
      $addToSet: { discount: discountId },
    });
  }

  // === Subcategory ===
  if (
    existingDiscount.discountPlan === 'subcategory' &&
    existingDiscount.targetSubcategory?.toString() !==
      updatedDiscount.targetSubcategory?.toString()
  ) {
    await subCategoryModel.findByIdAndUpdate(
      existingDiscount.targetSubcategory,
      {
        discount: null,
      }
    );
    await subCategoryModel.findByIdAndUpdate(
      updatedDiscount.targetSubcategory,
      {
        $addToSet: { discount: discountId },
      }
    );
  }

  // === Product ===
  if (
    existingDiscount.discountPlan === 'product' &&
    existingDiscount.targetProduct?.toString() !==
      updatedDiscount.targetProduct?.toString()
  ) {
    await productModel.findByIdAndUpdate(existingDiscount.targetProduct, {
      discount: null,
    });
    await productModel.findByIdAndUpdate(updatedDiscount.targetProduct, {
      $addToSet: { discount: discountId },
    });
  }

  apiResponse.sendSuccess(
    res,
    200,
    'Discount updated successfully',
    updatedDiscount
  );
});

// Delete Discount
exports.deleteDiscount = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Find the discount first
  const discount = await discountModel.findOne({ slug });
  if (!discount) {
    throw new customError(404, 'Discount not found');
  }

  // Remove discount reference from related models
  if (discount.discountPlan === 'category') {
    await categotoryModel.findByIdAndUpdate(discount.targetCategory, {
      discount: null,
    });
  }

  if (discount.discountPlan === 'subcategory') {
    await subCategoryModel.findByIdAndUpdate(discount.targetSubcategory, {discount: null,});
  }

  if (discount.discountPlan === 'product') {
    await productModel.findByIdAndUpdate(discount.targetProduct, {
      discount: null,
    });
  }

  // Delete the discount
  const deletedDiscount = await discountModel.deleteOne({ _id: discount._id });
  apiResponse.sendSuccess( res, 200, 'Discount deleted successfully', deletedDiscount);
});

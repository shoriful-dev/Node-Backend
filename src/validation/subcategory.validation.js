const Joi = require('joi');
const mongoose = require('mongoose');
const { customError } = require('../../utils/customError');

// helper: check if valid ObjectId
const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// SubCategory Validation Schema
const subCategoryValidationSchema = Joi.object(
  {
    name: Joi.string().trim().required().messages({
      'string.empty': 'SubCategory name cannot be empty.',
      'any.required': 'SubCategory name is required.',
    }),
    category: Joi.string().custom(isValidObjectId).required().messages({
      'any.invalid': 'Category ID is not valid.',
      'any.required': 'Category ID is required.',
    }),
    isActive: Joi.boolean().default(true),
  },
  {
    allowUnknown: true,
  }
);

// Export validation function
exports.validateSubCategory = async req => {
  try {
    const value = await subCategoryValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log('Error from validate SubCategory method:', error);
    throw new customError(401, error.details[0].message);
  }
};

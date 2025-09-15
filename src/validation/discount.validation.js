const Joi = require('joi');
const mongoose = require('mongoose');
const { customError } = require('../../utils/customError');

// Helper: check valid ObjectId
const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// Discount Validation Schema
const discountValidationSchema = Joi.object(
  {
    discountValidFrom: Joi.date().required().messages({
      'date.base': 'Discount valid from must be a valid date.',
      'any.required': 'Discount valid from date is required.',
    }),
    discountValidTo: Joi.date()
      .greater(Joi.ref('discountValidFrom'))
      .required()
      .messages({
        'date.base': 'Discount valid to must be a valid date.',
        'date.greater':
          'Discount valid to date must be after discount valid from date.',
        'any.required': 'Discount valid to date is required.',
      }),
    discountName: Joi.string().trim().required().messages({
      'string.empty': 'Discount name cannot be empty.',
      'any.required': 'Discount name is required.',
    }),
    discountValueByAmount: Joi.number().min(0).messages({
      'number.base': 'Discount value by amount must be a number.',
      'number.min': 'Discount value by amount cannot be negative.',
    }),
    discountValueByPercentance: Joi.number().min(0).max(100).messages({
      'number.base': 'Discount value by percentage must be a number.',
      'number.min': 'Discount percentage cannot be negative.',
      'number.max': 'Discount percentage cannot be greater than 100.',
    }),
    discountType: Joi.string().valid('tk', 'percentance').required().messages({
      'any.only': "Discount type must be either 'tk' or 'percentance'.",
      'any.required': 'Discount type is required.',
    }),
    discountPlan: Joi.string()
      .valid('flat', 'category', 'product', 'subcategory')
      .required()
      .messages({
        'any.only':
          "Discount plan must be either 'flat', 'category' or 'product' subcategory.",
        'any.required': 'Discount plan is required.',
      }),
    targetProduct: Joi.string().allow(null).messages({
      'any.invalid': 'Target product ID is not valid.',
    }),
    targetCategory: Joi.string().allow(null).messages({
      'any.invalid': 'Target category ID is not valid.',
    }),
    targetSubcategory: Joi.string().allow(null).messages({
      'any.invalid': 'Target subcategory ID is not valid.',
    }),
    isActive: Joi.boolean().default(true),
  },
  {
    allowUnknown: true,
  }
);

// Export validation function
exports.validateDiscount = async req => {
  try {
    const value = await discountValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log('Error from validate Discount method:', error);
    throw new customError(
      401,
      error.details ? error.details[0].message : error.message
    );
  }
};

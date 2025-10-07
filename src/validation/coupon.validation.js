const Joi = require('joi');
const { customError } = require('../../utils/customError');

// Coupon Validation Schema
const couponValidationSchema = Joi.object({
  code: Joi.string().trim().required().messages({
    'string.empty': 'Coupon code cannot be empty.',
    'any.required': 'Coupon code is required.',
  }),
  expireAt: Joi.date().greater('now').required().messages({
    'date.base': 'Please provide a valid expiration date.',
    'any.required': 'Expiration date is required.',
    'date.greater': 'Expiration date must be in the future.',
  }),
  usageLimit: Joi.number().integer().min(1).default(50).messages({
    'number.base': 'Usage limit must be a number.',
    'number.min': 'Usage limit must be at least 1.',
  }),
  discountType: Joi.string()
    .valid('percentage', 'tk')
    .required()
    .messages({
      'string.empty': 'Discount type cannot be empty.',
      'any.required': 'Discount type is required.',
      'any.only': 'Discount type must be either "percentage" or "tk".',
    }),
  discountValue: Joi.number().min(0).required().messages({
    'number.base': 'Discount value must be a number.',
    'number.min': 'Discount value must be at least 0.',
    'any.required': 'Discount value is required.',
  }),
}, { allowUnknown: true });

// Export validation function
exports.validateCoupon = async (req) => {
  try {
    const value = await couponValidationSchema.validateAsync(req.body);

    return {
      code: value.code,
      expireAt: value.expireAt,
      usageLimit: value.usageLimit,
      discountType: value.discountType,
      discountValue: value.discountValue,
    };
  } catch (error) {
    console.log('Error from validateCoupon method:', error);
    throw new customError(401, error.details ? error.details[0].message : error.message);
  }
};

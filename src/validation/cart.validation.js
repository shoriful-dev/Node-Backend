const Joi = require("joi");
const mongoose = require("mongoose");
const { customError } = require("../../utils/customError");

// Helper to validate ObjectId
const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

// Cart Single-Item Validation Schema
const cartItemActionSchema = Joi.object(
  {
    user: Joi.string()
      .custom(isValidObjectId)
      .allow(null, "")
      .optional()
      .messages({
        "any.invalid": "User ID must be a valid ObjectId.",
      }),

    guestId: Joi.string().optional().allow(null, "").messages({
      "string.base": "Guest ID must be a string.",
    }),

    productId: Joi.string().custom(isValidObjectId).allow(null, "").messages({
      "any.invalid": "Product ID must be a valid ObjectId.",
      "any.required": "Product ID is required.",
    }),

    variantId: Joi.string().custom(isValidObjectId).allow(null, "").messages({
      "any.invalid": "Variant ID must be a valid ObjectId.",
      "any.required": "Variant ID is required.",
    }),

    color: Joi.string().trim().required().messages({
      "string.empty": "Color is required.",
      "any.required": "Color is required.",
    }),

    size: Joi.string().trim().required().messages({
      "string.empty": "Size is required.",
      "any.required": "Size is required.",
    }),

    quantity: Joi.number().integer().min(1).required().messages({
      "number.base": "Quantity must be a number.",
      "number.min": "Quantity must be at least 1.",
      "any.required": "Quantity is required.",
    }),
    coupon: Joi.string().allow(null, "").messages({
      "string.base": "coupon must be a string.",
    }),
  },
  {
    allowUnknown: true, // allow other non-validated fields if needed
  }
);

// Export validation function
exports.validateCartItemAction = async (req) => {
  try {
    const value = await cartItemActionSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log("Error from validateCartItemAction:", error);
    throw new customError(
      400,
      error.details ? error.details[0].message : error.message
    );
  }
};

const Joi = require("joi");
const mongoose = require("mongoose");
const { customError } = require("../../utils/customError");

// Helper function to check for valid ObjectId
const isValidObjectId = (value, helpers) => {
  if (value === null) return value; // allow nulls where applicable
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

// Review Validation Schema
const reviewValidationSchema = Joi.object({
  reviewer: Joi.string()
    .custom(isValidObjectId, "ObjectId Validation")
    .required()
    .messages({
      "any.invalid": "Reviewer ID must be a valid ObjectId.",
      "any.required": "Reviewer ID is required.",
    }),

  comment: Joi.string().trim().required().messages({
    "string.empty": "Comment cannot be empty.",
    "any.required": "Comment is required.",
  }),

  rating: Joi.number().min(1).max(5).required().messages({
    "number.base": "Rating must be a number.",
    "number.min": "Rating must be at least 1.",
    "number.max": "Rating cannot be more than 5.",
    "any.required": "Rating is required.",
  }),

  product: Joi.alternatives()
    .try(
      Joi.string().custom(isValidObjectId, "ObjectId Validation"),
      Joi.valid(null)
    )
    .optional()
    .messages({
      "any.invalid": "Product ID must be a valid ObjectId or null.",
    }),

  variant: Joi.alternatives()
    .try(
      Joi.string().custom(isValidObjectId, "ObjectId Validation"),
      Joi.valid(null)
    )
    .optional()
    .messages({
      "any.invalid": "Variant ID must be a valid ObjectId or null.",
    }),
})
  // Custom rule: at least one of 'product' or 'variant' must be provided
  .custom((value, helpers) => {
    if (!value.product && !value.variant) {
      return helpers.error("object.missing", { keys: ["product", "variant"] });
    }
    return value;
  })
  .messages({
    "object.missing": "At least one of product or variant must be provided.",
  });

// Exported validation function
exports.validateReview = async (req) => {
  try {
    const value = await reviewValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log("Error from validateReview:", error);
    throw new customError(
      400,
      error.details ? error.details[0].message : error.message
    );
  }
};

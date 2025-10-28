const Joi = require("joi");
const { customError } = require("../../utils/customError");

// DeliveryCharge Validation Schema
const deliveryChargeValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": "Name must be a string.",
      "string.empty": "Name cannot be empty.",
      "any.required": "Name is required.",
    }),

  amount: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Amount must be a number.",
      "number.min": "Amount cannot be negative.",
      "any.required": "Amount is required.",
    }),

  isActive: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": "isActive must be a boolean value (true or false).",
    }),
});

// Exported validation function
exports.validateDeliveryCharge = async (req) => {
  try {
    const value = await deliveryChargeValidationSchema.validateAsync(req.body, {
      abortEarly: true, // Return only the first error
      stripUnknown: true, // Remove any extra fields
    });
    return value;
  } catch (error) {
    console.log("Error from validateDeliveryCharge:", error);
    throw new customError(
      400,
      error.details ? error.details[0].message : error.message
    );
  }
};

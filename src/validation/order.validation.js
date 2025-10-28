const Joi = require("joi");
const mongoose = require("mongoose");
const { customError } = require("../../utils/customError");

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (value, helpers) => {
  if (value === null) return value;
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

// Joi Schema for Order Validation
const orderValidationSchema = Joi.object({
  user: Joi.string().trim().allow(null, "").optional().messages({
    "string.empty": "User ID cannot be empty.",
    "any.required": "User ID is required.",
  }),

  guestId: Joi.string().allow(null, "").optional(),

  shippinfo: Joi.object({
    firstName: Joi.string().trim().required().messages({
      "string.empty": "First name cannot be empty.",
      "any.required": "First name is required.",
    }),

    phone: Joi.string()
      .pattern(/^(?:\+88|88)?01[3-9]\d{8}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Please provide a valid Bangladeshi phone number (e.g., 01XXXXXXXXX or +8801XXXXXXXXX).",
        "string.empty": "Phone number cannot be empty.",
        "any.required": "Phone number is required.",
      }),

    address: Joi.string().trim().required().messages({
      "string.empty": "Address cannot be empty.",
      "any.required": "Address is required.",
    }),

    email: Joi.string().email().optional().messages({
      "string.email": "Please provide a valid email address.",
    }),

    country: Joi.string().default("Bangladesh"),

    deliveryZone: Joi.string()
      .valid("inside_dhaka", "outside_dhaka", "sub_area")
      .messages({
        "any.only":
          'Delivery zone must be one of "inside_dhaka", "outside_dhaka", or "sub_area".',
        "any.required": "Delivery zone is required.",
      }),
  }).required(),

  deliveryCharge: Joi.string()
    .custom(isValidObjectId, "ObjectId Validation")
    .required()
    .messages({
      "any.invalid": "DeliveryCharge ID must be a valid ObjectId.",
      "any.required": "DeliveryCharge ID is required.",
    }),
}).options({ allowUnknown: true });

// Validation Function
exports.validateOrder = async (req) => {
  try {
    const value = await orderValidationSchema.validateAsync(req.body, {
      abortEarly: true, // stop on first error
      stripUnknown: true, // remove extra fields
    });
    return value;
  } catch (error) {
    console.log("Error from validateOrder method:", error);
    throw new customError(
      400,
      error.details ? error.details[0].message : error.message
    );
  }
};

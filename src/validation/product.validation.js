const Joi = require("joi");
const { customError } = require("../../utils/customError");

const productValidationSchema = Joi.object(
  {
    name: Joi.string().trim().required().messages({
      "string.empty": "Product name cannot be empty.",
      "any.required": "Product name is required.",
    }),
    description: Joi.string().allow("", null),
    category: Joi.string().hex().length(24).required().messages({
      "string.length": "Invalid category ID.",
      "any.required": "Category is required.",
    }),
    subCategory: Joi.string().hex().length(24).allow(null, ""),
    brand: Joi.string().hex().length(24).allow(null, ""),
    variant: Joi.string().hex().length(24).allow(null, ""),
    discount: Joi.string().hex().length(24).allow(null, ""),
    manufactureCountry: Joi.string().allow("", null),
    rating: Joi.number().min(0).max(5).allow(null),
    warrantyInformation: Joi.string().allow("", null),
    warrantyClaim: Joi.boolean().default(true),
    warrentyexpires: Joi.date().allow(null),
    availabilityStatus: Joi.string().valid(
      "In Stock",
      "Out of Stock",
      "Preorder"
    ),
    shippingInformation: Joi.string().allow("", null),
    sku: Joi.string().required().messages({
      "string.empty": "SKU is required.",
    }),
    QrCode: Joi.string().allow("", null),
    barCode: Joi.string().allow("", null),
    groupUnit: Joi.string()
      .valid("Box", "Packet", "Dozen", "Custom")
      .allow("", null),
    groupUnitQuantity: Joi.number().allow(null).optional(),
    unit: Joi.string()
      .valid("Piece", "Kg", "Gram", "Packet", "Custom")
      .allow("", null),
    variantType: Joi.string()
      .valid("singleVariant", "multipleVariant")
      .required(),
    size: Joi.string().allow("", null),
    color: Joi.string().allow("", null),
    stock: Joi.number().allow(null),
    warehouseLocation: Joi.string().hex().length(24).allow(null, ""),
    retailPrice: Joi.number().messages({
      "number.base": "Retail price must be a number.",
      "any.required": "Retail price is required.",
    }),
    retailPriceProfitAmount: Joi.number().allow(null),
    retailPriceProfitPercentance: Joi.number().max(100).allow(null),
    wholesalePrice: Joi.number().messages({
      "number.base": "Wholesale price must be a number.",
      "any.required": "Wholesale price is required.",
    }),
    alertQuantity: Joi.number().allow(null),
    stockAlert: Joi.boolean().allow(null),
    instock: Joi.boolean().allow(null),
    isActive: Joi.boolean().allow(null),
    minimumOrderQuantity: Joi.number().allow(null),
    tag: Joi.array().items(Joi.string()).allow(null),
    reviews: Joi.array().items(Joi.string().hex().length(24)).allow(null),
  },
  {
    allowUnknown: true,
  }
);

// Product Validation Function
exports.validateProduct = async (req) => {
  try {
    const value = await productValidationSchema.validateAsync(req.body);

    // Validate image files
    const acceptTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!req?.files?.image || req.files.image.length === 0) {
      throw new customError(400, "At least one product image is required.");
    }

    for (const file of req.files.image) {
      if (!acceptTypes.includes(file.mimetype)) {
        throw new customError(
          400,
          `Image type '${file.mimetype}' is not allowed.`
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new customError(400, "Each image must be under 5MB.");
      }
    }

    return {
      ...value,
      image: req.files.image, // returning full image array
    };
  } catch (error) {
    console.log("Error from validateProduct method:", error);
    throw new customError(
      401,
      error.details ? error.details[0].message : error.message
    );
  }
};

const Joi = require("joi");
const mongoose = require("mongoose");
const { customError } = require("../../utils/customError");

// Validate MongoDB ObjectId
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

// Variant Validation Schema
const variantValidationSchema = Joi.object(
  {
    product: Joi.string().custom(objectId).required().messages({
      "any.required": "প্রোডাক্ট আইডি আবশ্যক।",
      "any.invalid": "বৈধ প্রোডাক্ট আইডি প্রদান করুন।",
    }),
    variantName: Joi.string().trim().required().messages({
      "string.empty": "ভ্যারিয়েন্ট নাম ফাঁকা রাখা যাবে না।",
      "any.required": "ভ্যারিয়েন্ট নাম আবশ্যক।",
    }),
    variantDescription: Joi.string().trim().allow("", null),
    size: Joi.string().default("N/A"),
    color: Joi.string(),
    stockVariant: Joi.number().min(0).required().messages({
      "number.base": "স্টক অবশ্যই একটি সংখ্যা হতে হবে।",
      "any.required": "স্টক আবশ্যক।",
    }),
    alertVariantStock: Joi.number().min(0).default(5),
    retailPrice: Joi.number().min(0).required().messages({
      "any.required": "রিটেইল মূল্য আবশ্যক।",
    }),
    wholesalePrice: Joi.number().min(0).required().messages({
      "any.required": "হোলসেল মূল্য আবশ্যক।",
    }),
    isActive: Joi.boolean().default(true),
  },
  {
    allowUnknown: true,
  }
);

// ✅ Main Validation Function (with multi-image support)
exports.validateVariant = async (req) => {
  try {
    // Validate body
    const value = await variantValidationSchema.validateAsync(req.body);

    const acceptedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    const maxFileSize = 15 * 1024 * 1024; // 15MB
    const maxFileCount = 5; // Optional: Limit to 5 files

    const files = req?.files?.image;

    if (!files || files.length === 0) {
      throw new customError(400, "কমপক্ষে একটি ইমেজ আপলোড করতে হবে।");
    }

    if (files.length > maxFileCount) {
      throw new customError(
        400,
        `সর্বোচ্চ ${maxFileCount} টি ইমেজ আপলোড করা যাবে।`
      );
    }

    for (const file of files) {
      if (!acceptedMimeTypes.includes(file.mimetype)) {
        throw new customError(
          400,
          `অনুমোদিত ইমেজ ফরম্যাট নয়: ${file.originalname}`
        );
      }

      if (file.size > maxFileSize) {
        throw new customError(
          400,
          `ইমেজটি বড়: ${file.originalname} (সর্বোচ্চ 15MB অনুমোদিত)`
        );
      }
    }

    // All good: return data
    return { ...value, images: files };
  } catch (error) {
    console.error("Variant Validation Error:", error);
    throw new customError(401, error.details?.[0]?.message || error.message);
  }
};

const Joi = require('joi');
const { customError } = require('../../utils/customError');

// Category Validation Schema
const categoryValidationSchema = Joi.object(
  {
    name: Joi.string().trim().required().messages({
      'string.empty': 'ক্যাটাগরির নাম ফাঁকা রাখা যাবে না।',
      'any.required': 'ক্যাটাগরির নাম আবশ্যক।',
    }),
  },
  {
    allowUnknown: true,
  }
);

// Export validation function
exports.validateCategory = async req => {
  try {
    const value = await categoryValidationSchema.validateAsync(req.body);
    // accept mimeType
    const acceptType = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!acceptType.includes(req?.files?.image[0].mimetype)) {
      throw new customError(400, 'this image type is not allowed');
    }
    if (req.files?.image[0].size > 5 * 1024 * 1024) {
      throw new customError(
        400,
        'this image size is not allowed image size maximum 5MB'
      );
    }
    if (req.files.image?.length > 1) {
      throw new customError(
        400,
        'this image size is not allowed image size maximum 1'
      );
    }
    return { name: value.name, image: req?.files?.image[0] };
  } catch (error) {
    console.log('Error from validate Category method:', error);
    throw new customError(401, error.details[0].message);
  }
};

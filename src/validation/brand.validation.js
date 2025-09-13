const Joi = require('joi');
const { customError } = require('../../utils/customError');

// Brand Validation Schema
const brandValidationSchema = Joi.object(
  {
    name: Joi.string().trim().required().messages({
      'string.empty': 'Brand name cannot be empty.',
      'any.required': 'Brand name is required.',
    }),
    since: Joi.number().required().messages({
      'number.base': 'Since must be a number.',
      'any.required': 'Since is required.',
    }),
    isActive: Joi.boolean().default(true),
  },
  {
    allowUnknown: true,
  }
);

// Export validation function
exports.validateBrand = async req => {
  try {
    const value = await brandValidationSchema.validateAsync(req.body);

    // accept only allowed image types
    const acceptType = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (!req?.files?.image || req.files.image.length === 0) {
      throw new customError(400, 'Brand image is required.');
    }

    if (!acceptType.includes(req.files.image[0].mimetype)) {
      throw new customError(400, 'This image type is not allowed.');
    }

    if (req.files.image[0].size > 5 * 1024 * 1024) {
      throw new customError(
        400,
        'Image size is too large. Maximum allowed size is 5MB.'
      );
    }

    if (req.files.image.length > 1) {
      throw new customError(400, 'Only 1 image is allowed for brand.');
    }

    return {
      name: value.name,
      since: value.since,
      isActive: value.isActive,
      image: req.files.image[0],
    };
  } catch (error) {
    console.log('Error from validate Brand method:', error);
    throw new customError(
      401,
      error.details ? error.details[0].message : error.message
    );
  }
};

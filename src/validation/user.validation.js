const Joi = require('joi');
const { customError } = require('../../utils/customError');

const userValidationSchema = Joi.object({
  email: Joi.string()
    .trim()
    .required()
    .pattern(/^[\w.-]+@[\w-]+\.[a-zA-Z]{2,4}$/)
    .messages({
      'string.empty': 'Email is required',
      'string.pattern.base': 'Please enter a valid email address',
      'any.required': 'Email field cannot be empty',
    }),

  password: Joi.string()
    .trim()
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password field cannot be empty',
      'string.pattern.base':
        'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character',
    }),
}, {
  allowUnknow: true,
});

exports.validateUser = async (req) => {
  try {
    const value = await userValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log('error from validateuser method', error)
    throw new customError(401, error.details[0].message);
  }
}

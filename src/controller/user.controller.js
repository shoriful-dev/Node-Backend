const { asyncHandler } = require('../../utils/asyncHandler');
const { customError } = require('../../utils/customError');

exports.Registration = asyncHandler((req, res) => {
  throw new customError(404, 'Email Missing');
});

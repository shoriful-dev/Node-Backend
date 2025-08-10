const { asyncHandler } = require('../../utils/asyncHandler');
const { customError } = require('../../utils/customError');
const { validateUser } = require('../validation/user.validation');

exports.Registration = asyncHandler( async(req, res) => {
  const value = await validateUser(req);
  console.log(value);
});

const { asyncHandler } = require("../../utils/asyncHandler");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { customError } = require("../../utils/customError");

exports.authguard = async (req, res, next) => {
  const accesToken = req?.headers?.authorization?.replace("Bearer ", "");

  try {
    if (!accesToken) {
      throw new customError(401, "No token provided!");
    }

    let tokenValue;
    try {
      tokenValue = jwt.verify(accesToken, process.env.ACCESSTOKEN_SECRET);
    } catch (err) {
      // JWT error captured here (expired, malformed, etc.)
      throw new customError(410, "Token invalid or expired");
    }

    const userinfo = await userModel.findById(tokenValue.userId);
    if (!userinfo) throw new customError(401, "User not found!");

    req.user = userinfo;
    next();
  } catch (error) {
    next(error); // send error to your global error handler
  }
};

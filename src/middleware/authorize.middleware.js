const { customError } = require("../../utils/customError");
const userModel = require("../models/user.model");

exports.authrorize = (permission) => {
  return async (req, res, next) => {
    const user = req.user;
    // collect all permissions from all roles
    const userWithRoles = await userModel
      .findById(user._id)
      .populate({
        path: "roles",
        populate: {
          path: "permissions",
          select: "-_id name",
        },
      })
      .select("-_id roles");

    const hasPermission = userWithRoles.roles
      .flatMap((role) => role.permissions)
      .some(({ name }) => name === permission);
    if (!hasPermission) {
      throw new customError(401, "Forbidden ");
    }
    next();
  };
};

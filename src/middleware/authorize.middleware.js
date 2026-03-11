const Role = require("../models/role.model");

exports.authrorize = (permission) => {
  return (req, res, next) => {
    const user = req.user;
    // collect all permissions from all roles
    // const userPermissions = user.roles.map(async (id) => {
    //   return await Role.findById(id).populate({
    //     path: "roles",
    //     populate: {
    //       path: "permissions",
    //       model: "Permission",
    //     },
    //   });
    // });
    console.log(user);
  };
};

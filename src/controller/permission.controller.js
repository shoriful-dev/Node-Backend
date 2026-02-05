const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const permissionModel = require("../models/permission.model");
const userModel = require("../models/user.model");
const { getAllPermissonDTO, permissionDTO, userDTO } = require("../Dtos/allapi.dto");

// Create Permission
exports.createPermission = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new customError("Permission name is required", 400);
  const permission = await permissionModel.create({ name, ...req.body });
  if (!permission) throw new customError("Failed to create permission", 500);
  apiResponse(res, 201, true, "Permission created successfully", permission);
});

// get all persmissions
exports.getAllPermissions = asyncHandler(async (req, res) => {
  const { slug } = req.query;
  if (slug) {
    const permission = await permissionModel.findOne({ slug });
    if (!permission) throw new customError("Permission not found", 404);
    return apiResponse(
      res,
      200,
      "Permission fetched successfully",
      permissionDTO(permission),
    );
  }
  const permissions = await permissionModel.find({});
  apiResponse.sendSuccess(
    res,
    200,
    "Permissions fetched successfully",
    getAllPermissonDTO(permissions),
  );
});

// delete permission
exports.deletePermission = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const permission = await permissionModel.findOneAndDelete({ slug });
  if (!permission) throw new customError("Permission not found", 404);
  apiResponse(res, 200, true, "Permission deleted successfully", null);
});

// -------------> add user permisison controller
exports.addUserPermission = asyncHandler(async (req, res) => {
  const { user, permissionList } = req.body;
  if (!user && !permissionList.length) {
    throw new customError(401, "data need");
  }
  // find the user
  const userData = await userModel.findOne({ _id: user });
  userData.permissions = permissionList;
  await userData.save()
  // console.log(userDTO(userData));
  apiResponse.sendSuccess(res,200,'permisson assign sucessfully' , userDTO(userData))
});

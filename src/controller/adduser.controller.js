const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const userModel = require("../models/user.model");
const { userDTO } = require("../Dtos/allapi.dto");

// @desc add new user
exports.addUser = asyncHandler(async (req, res) => {
  // Implementation for adding a new user will go here
  const userData = new userModel({
    ...req.body,
    roles: [req.body.role],
  });
  await userData.save();
  if (!userData) {
    throw new customError(400, "Unable to add user");
  }
  apiResponse.sendSuccess(
    res,
    201,
    "User added successfully",
    userDTO(userData),
  );
});

// @desc get all users and filter users by role and filter users by name
exports.getAllUsers = asyncHandler(async (req, res) => {
  // Implementation for getting all users will go here
  const { role, name } = req.query;
  let filter = {};
  if (role) {
    filter.roles = role;
  } else if (name) {
    filter.name = { $regex: name, $options: "i" }; // case-insensitive search
  } else {
    filter.roles = { $exists: true, $type: "array", $not: { $size: 0 } };
  }
  const users = await userModel.find(filter).populate({
    path: "roles",
  });
  if (!users || users.length === 0) {
    apiResponse.sendError(res, 404, "No users found");
    return;
  }
  apiResponse.sendSuccess(
    res,
    200,
    "Users fetched successfully",
    users.map((user) => userDTO(user)),
  );
});

// @desc soft delete user by id
exports.deleteUserById = asyncHandler(async (req, res) => {
  // Implementation for soft deleting a user by id will go here
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    apiResponse.sendError(res, 404, "User not found");
    return;
  }
  user.isBlocked = true;
  user.isActive = false;
  await user.save();
  apiResponse.sendSuccess(res, 200, "User blocked successfully");
});

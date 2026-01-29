const { asyncHandler } = require("../../utils/asyncHandler");
const { apiResponse } = require("../../utils/apiResponse");
const { customError } = require("../../utils/customError");
const roleModel = require("../models/role.model");

// @desc create new role
exports.createRole = asyncHandler(async (req, res) => {
  const { name } = req.body;
    if (!name) {
        throw new customError("Role name is required", 400);
    }
    // Here you would typically save the role to the database
    const newRole = await roleModel.create({ name });
    if (!newRole) {
        throw new customError("Failed to create role", 500);
    }
    apiResponse.sendSuccess(res, 201, "Role created successfully", newRole);
});

// get all role and single role
exports.GetRole = asyncHandler(async(req,res)=>{
    const {slug} = req.query
    if (!slug) {
       const role = await roleModel.find();
       apiResponse.sendSuccess(res , 201 ,"all role found successfully", role);
    }
     const single = await roleModel.findOne({ slug });
     apiResponse.sendSuccess(
       res,
       201,
       `role found successfully`,
       single,
     );
})
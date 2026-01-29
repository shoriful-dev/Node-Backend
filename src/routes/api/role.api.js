const express = require("express");
const _ = express.Router();
const roleController = require('../../controller/role.controller')

_.route("/create_role").post(roleController.createRole);
_.route("/all_role").get(roleController.GetRole);
// _.route("/update-role/:id").put(roleController.updateRole);

module.exports = _;

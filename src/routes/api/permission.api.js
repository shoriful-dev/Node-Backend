const express = require("express");
const _ = express.Router();
const permissionController =require('../../controller/permission.controller')

_.route("/create-permisson").post(permissionController.createPermission);
_.route("/get-permisson").get(permissionController.getAllPermissions);

// add user permission
_.route("/adduserpermission").put(permissionController.addUserPermission);

module.exports = _;

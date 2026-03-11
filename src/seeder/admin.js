const Permission = require("../models/permission.model");
const Role = require("../models/role.model");

async function seedAdminRole() {
  await Role.deleteMany();
  const getAllPermissions = await Permission.find().select("_id");
  await Role.create({
    name: "admin",
    permissions: getAllPermissions,
  });
  console.log("admin role seeded successfully");
}
module.exports = seedAdminRole;

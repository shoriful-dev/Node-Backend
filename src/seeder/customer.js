const { ConnectDatabase } = require("../database/db.config");
const Permission = require("../models/permission.model");
const Role = require("../models/role.model");
const customerPermissions = [
  // product browsing
  "product:read",
  "product:list",

  // category browsing
  "category:read",
  "category:list",

  // brand browsing
  "brand:read",
  "brand:list",

  // cart
  "cart:add_item",
  "cart:remove_item",
  "cart:update_item",
  "cart:view",
  "cart:clear",

  // order
  "order:create",
  "order:read",
  "order:cancel",

  // payment
  "payment:create",
  "payment:read",

  // coupon
  "coupon:apply",

  // review
  "review:create",
  "review:read",
  "review:update",
];
async function seedCustomerRole() {
  const permissions = await Permission.find({
    name: { $in: customerPermissions },
  }).select("_id");
  await Role.create({
    name: "customer",
    permissions,
  });
  console.log("customer role seeded successfully");
}

module.exports = seedCustomerRole;

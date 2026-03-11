const Permission = require("../models/permission.model");

const permissions = [
  // USER
  "user:create",
  "user:read",
  "user:update",
  "user:delete",
  "user:list",

  // ROLE
  "role:create",
  "role:read",
  "role:update",
  "role:delete",
  "role:list",

  // PERMISSION
  "permission:create",
  "permission:read",
  "permission:update",
  "permission:delete",
  "permission:list",

  // PRODUCT
  "product:create",
  "product:read",
  "product:update",
  "product:delete",
  "product:list",
  "product:publish",
  "product:unpublish",

  // CATEGORY
  "category:create",
  "category:read",
  "category:update",
  "category:delete",
  "category:list",

  // BRAND
  "brand:create",
  "brand:read",
  "brand:update",
  "brand:delete",
  "brand:list",

  // INVENTORY
  "inventory:create",
  "inventory:read",
  "inventory:update",
  "inventory:delete",
  "inventory:list",
  "inventory:adjust",

  // CART
  "cart:add_item",
  "cart:remove_item",
  "cart:update_item",
  "cart:view",
  "cart:clear",

  // ORDER
  "order:create",
  "order:read",
  "order:update",
  "order:delete",
  "order:list",
  "order:cancel",
  "order:refund",
  "order:update_status",

  // PAYMENT
  "payment:create",
  "payment:read",
  "payment:refund",
  "payment:list",

  // SHIPPING
  "shipping:create",
  "shipping:read",
  "shipping:update",
  "shipping:delete",
  "shipping:list",
  "shipping:update_status",

  // COUPON
  "coupon:create",
  "coupon:read",
  "coupon:update",
  "coupon:delete",
  "coupon:list",
  "coupon:apply",

  // REVIEW
  "review:create",
  "review:read",
  "review:update",
  "review:delete",
  "review:list",
  "review:moderate",

  // ANALYTICS
  "analytics:view_sales",
  "analytics:view_customers",
  "analytics:view_products",
  "analytics:view_revenue",

  // SETTINGS
  "settings:read",
  "settings:update",
];

const data = permissions.map((name) => ({ name }));
async function seedPermissions() {
  await Permission.deleteMany();
  await Permission.insertMany(data, { ordered: false });
  console.log("Permissions seeded successfully");
}

module.exports = seedPermissions;

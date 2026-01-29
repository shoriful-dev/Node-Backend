const mongoose = require("mongoose");
const permissonModel = require('../models/permission.model')
const { ConnectDatabase } = require("../database/db.config");
const PermissionArr = ["Brand" , "Category", "Product", "Order", "User" , "SubCategory" , "Role" , "Coupon" , "Blog" , "Permission" , "Variant" , "DeliverCharge" , "Discount" , "Invoice" , "WareHouse"];


// connected to database
ConnectDatabase()
  .then(() => {
    console.log("Seeding Db Connected Successfully");
   seedPermissions().then(() => {
      console.log("Seeding Completed");
      process.exit(0);
    });
  })
  .catch((err) => {
    console.log("Seeding Db Connection Failed", err);
    process.exit(0);
  });

// seeding permissions
const seedPermissions = async () => {
  try {
    for (const permissionName of PermissionArr) {
      const newPermission = new permissonModel({ name: permissionName  });
      console.log(`New Permission Create Sucessfully`, newPermission.name);
      await newPermission.save();
    }
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};

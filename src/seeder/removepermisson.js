const mongoose = require("mongoose");
const permissonModel = require('../models/permission.model')
const { ConnectDatabase } = require("../database/db.config");
const PermissionArr = ["Brand" , "Category", "Product", "Order", "User" , "SubCategory" , "Role" , "Coupon" , "Blog" , "Permission" , "Variant" , "DeliverCharge" , "Discount" , "Invoice" , "WareHouse"];


// connected to database
ConnectDatabase()
  .then(() => {
    console.log("Delete Db Connected Successfully");
   deleteAllPermission().then(() => {
     console.log("Delete Completed");
     process.exit(0);
   });
  })
  .catch((err) => {
    console.log("Delete Db Connection Failed", err);
    process.exit(0);
  });

// seeding permissions
const deleteAllPermission = async () => {
  try {
     await permissonModel.deleteMany();
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};



const mongoose = require("mongoose");
const roleModel = require("../models/role.model");
const { ConnectDatabase } = require("../database/db.config");
const RoleArr = ["admin", "user", "guest"];

// connected to database
ConnectDatabase()
  .then(() => {
    console.log("Seeding Db Connected Successfully");
    seedRoles().then(() => {
      console.log("Seeding Completed");
      process.exit(0);
    });
  })
  .catch((err) => {
    console.log("Seeding Db Connection Failed", err);
    process.exit(0);
  });

// seeding roles
const seedRoles = async () => {
  try {
    for (const roleName of RoleArr) {
      const newRole = new roleModel({ name: roleName });
      console.log(`New Role Create Sucessfully`, newRole.name);
      await newRole.save();
    }
  } catch (error) {
    console.error("Error seeding roles:", error);
  }
};

const { ConnectDatabase } = require("../database/db.config");
const seedAdminRole = require("./admin");
const seedCustomerRole = require("./customer");
const seedPermissions = require("./permission");

async function seed() {
  await ConnectDatabase();
  await seedPermissions();
  await seedAdminRole();
  await seedCustomerRole();
}

seed().finally(() => process.exit(1));

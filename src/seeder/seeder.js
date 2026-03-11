const { ConnectDatabase } = require("../database/db.config");
const seedPermissions = require("./permission");

async function seed() {
  await ConnectDatabase();
  await seedPermissions();
}

seed().finally(() => process.exit(1));

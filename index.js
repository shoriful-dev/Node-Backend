require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config();
const { ConnectDatabase } = require("./src/database/db.config");
const { httpServer } = require("./src/app");

ConnectDatabase()
  .then(() => {
    httpServer.listen(process.env.PORT || 5050, () => {
      console.log(`Database running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error from Database Connection", error);
  });

require('dotenv').config();
const { ConnectDatabase } = require('./src/database/db.config');
const { app } = require('./src/app');

ConnectDatabase()
  .then(() => {
    app.listen(process.env.PORT || 5050, () => {
      console.log(`Database running on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.log('Error from Database Connection', error);
  });

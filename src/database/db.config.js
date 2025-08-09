require('dotenv').config();
const mongoose = require('mongoose');

exports.ConnectDatabase = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL);
    console.log('Database connection successfully.....', db.connection.host);
  } catch (error) {
    console.log('Error from Database Connection', error);
  }
};

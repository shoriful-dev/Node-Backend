const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { globalErrorHandler } = require('../utils/globalErrorHandler');
const app = express();

// make a json to object middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// routes
app.use('/api/v1', require('./routes/index.api'));

// Global Error Handeling  Middleware
app.use(globalErrorHandler);

module.exports = { app };

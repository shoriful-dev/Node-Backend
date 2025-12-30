const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { globalErrorHandler } = require("../utils/globalErrorHandler");
const { createServer } = require("http");
const { initSocket } = require("./socket-io/server");
const compression = require('compression')

const app = express();
const httpServer = createServer(app);

// make a json to object middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression())
app.use(cors(
    {
        origin:['http://localhost:5173'],
        credentials:true,
    }
));

// routes
app.use("/api/v1", require("./routes/index.api"));

// Global Error Handeling  Middleware
app.use(globalErrorHandler);
initSocket(httpServer);
module.exports = { httpServer };

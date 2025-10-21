const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { globalErrorHandler } = require("../utils/globalErrorHandler");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
// make a json to object middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// routes
app.use("/api/v1", require("./routes/index.api"));

try {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
} catch (error) {
  console.log(error);
}
// Global Error Handeling  Middleware
app.use(globalErrorHandler);

module.exports = { httpServer };

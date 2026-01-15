const { Server } = require("socket.io");
let io = null;
module.exports = {
  initSocket: (httpServer) => {
    try {
      io = new Server(httpServer, {
        cors: {
          origin:         ['http://localhost:5173','http://localhost:5174'],
        },
      });

      //   server notifed when client is connected
      io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        const userId = socket.handshake.query.userId;
        socket.join(userId);
        socket.on("disconnect", () => {
          console.log("User disconnected:");
        });
        socket.on("test", (dat) => {
          console.log("from data client side", dat);
        });
      });
    } catch (error) {
      console.log(error);
    }
  },
  getIo: () => {
    if (io !== null) {
      return io;
    }
  },
};

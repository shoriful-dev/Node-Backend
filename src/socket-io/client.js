const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  query: { userId: "123" },
});

// client-side
socket.on("connect", () => {
  console.log("client connected sucesfully to server ", socket.id);
});

socket.on("addtocart", (data) => {
  console.log("data is ", data);
});

socket.emit("test", "hello");

socket.on("disconnect", () => {
  console.log("client disconnected sucesfully to server ", socket.id);
});

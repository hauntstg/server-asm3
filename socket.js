// let io;

// module.exports = {
//   init: (httpServer) => {
//     io = require("socket.io")(httpServer);
//     return io;
//   },
//   getIO: () => {
//     if (!io) {
//       throw new Error("Socket.io not initialized!");
//     }
//     return io;
//   },
// };
const { Server } = require("socket.io");

let io;

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: function (origin, callback) {
          const allowedOrigins = [
            "http://localhost:3000",
            "http://localhost:3001",
          ];
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS (socket)"));
          }
        },
        credentials: true,
        methods: ["GET", "POST"],
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error("Socket.io chưa được khởi tạo!");
    return io;
  },
};

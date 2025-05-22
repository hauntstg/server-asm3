const Message = require("../models/message");

module.exports = function (io) {
  try {
    // Khi có client (admin hoặc khách) kết nối
    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      // Khi user join room chat
      socket.on("joinRoom", ({ roomId, userType }) => {
        socket.join(roomId);
        console.log(`${userType} joined room: ${roomId}`);
      });

      // Khi gửi tin nhắn
      socket.on("message", async ({ roomId, message, sender }) => {
        try {
          console.log(`[${roomId}] ${sender}: ${message}`);
          const newMsg = new Message({
            roomId,
            sender,
            content: message,
          });
          await newMsg.save();
          // Gửi lại tin nhắn cho tất cả client trong phòng đó
          io.to(roomId).emit("message", {
            message,
            sender,
          });
        } catch (error) {
          console.log(error);
        }
      });

      // Khi kết thúc chat
      socket.on("endChat", ({ roomId }) => {
        console.log(`Chat ended in room ${roomId}`);
        io.to(roomId).emit("chatEnded");
        // Optional: xóa room ở DB, xóa người dùng khỏi phòng,...
      });

      // Ngắt kết nối
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

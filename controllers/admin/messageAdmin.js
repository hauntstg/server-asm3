const Message = require("../../models/message");

exports.getMessagesGroupByRoomId = async (req, res, next) => {
  try {
    const grouped = {};
    const messages = await Message.find().sort({ createdAt: -1 });
    // Mỗi dòng tin nhắn là 1 document trong MongoDB kể cả cùng 1 User mỗi lần gửi cũng sẽ lưu thành 1 document khác nhau
    // Nên việc đầu tiên là gom nhóm theo roomId {roomId: [message1, message2, ...]}
    await messages.forEach((doc) => {
      const roomId = doc.roomId;
      if (!grouped[roomId]) {
        grouped[roomId] = [];
      }
      grouped[roomId].push(doc);
    });

    res.status(200).json(grouped);
  } catch (error) {
    console.log(error);
  }
};

exports.getMessagesByRoomId = async (req, res, next) => {
  try {
    const { roomId } = req.query;

    const messages = await Message.find({ roomId });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
  }
};

const express = require("express");
const { authenticateToken, verifyRole } = require("../../middleware/is-auth");
const messageAdminController = require("../../controllers/admin/messageAdmin");

const router = express.Router();

router.get(
  "/admin/messages-group",
  messageAdminController.getMessagesGroupByRoomId
);

router.get(
  "/admin/messages-roomId",
  messageAdminController.getMessagesByRoomId
);

module.exports = router;

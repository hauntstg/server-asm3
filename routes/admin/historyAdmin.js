const express = require("express");
const { authenticateToken, verifyRole } = require("../../middleware/is-auth");
const historyAdminController = require("../../controllers/admin/historyAdmin");

const router = express.Router();

router.get(
  "/admin/history",
  authenticateToken,
  verifyRole(["admin"]),
  historyAdminController.getHistory
);

module.exports = router;

const express = require("express");
const { authenticateToken, verifyRole } = require("../../middleware/is-auth");
const dashboardController = require("../../controllers/admin/dashboard");

const router = express.Router();

router.get(
  "/admin/dashboard",
  authenticateToken,
  verifyRole(["admin"]),
  dashboardController.getDashboard
);

module.exports = router;

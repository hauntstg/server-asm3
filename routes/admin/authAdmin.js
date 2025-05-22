const express = require("express");
const { authenticateToken } = require("../../middleware/is-auth");
const authAdminController = require("../../controllers/admin/authAdmin");

const router = express.Router();

router.post("/admin/signin", authAdminController.signin);

router.get(
  "/admin/check-token",
  authenticateToken,
  authAdminController.checkToken
);

module.exports = router;

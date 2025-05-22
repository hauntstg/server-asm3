const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/users/signin", authController.signin);

router.post("/users/signup", authController.signup);

router.post("/users/logout", authController.logout);

router.get("/users/profile", authController.getProfile);

router.get("/users/:userId", authController.getUser);

// router.post("/addUser", loginController.addUser);

module.exports = router;

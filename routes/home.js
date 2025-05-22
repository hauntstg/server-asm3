const express = require("express");
const homeController = require("../controllers/home");

const router = express.Router();

router.get("/products", homeController.getProducts);

router.get("/products/:productId", homeController.getProduct);

module.exports = router;

const express = require("express");
const cartController = require("../controllers/cart");

const router = express.Router();

router.patch("/cart/add-to-cart", cartController.updateAddToCart);

router.patch("/cart/update-cart", cartController.updateCart);

module.exports = router;

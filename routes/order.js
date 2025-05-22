const express = require("express");
const orderController = require("../controllers/order");

const router = express.Router();

router.get("/orders/user/:userId", orderController.getOrdersByUser);

router.get("/orders/order/:orderId", orderController.getOrderDetail);

router.post("/orders/add-order", orderController.postOrder);

module.exports = router;

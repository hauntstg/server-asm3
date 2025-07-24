const express = require("express");
const homeController = require("../controllers/home");

const router = express.Router();

// danh sách sản phẩm không phân trang
router.get("/product-list", homeController.getProductList);

// danh sách sản phẩm có phân trang
router.get("/products", homeController.getProducts);

router.get("/products/:productId", homeController.getProduct);

module.exports = router;

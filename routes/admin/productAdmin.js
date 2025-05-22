const express = require("express");
const path = require("path");
const { authenticateToken, verifyRole } = require("../../middleware/is-auth");
const productAdminController = require("../../controllers/admin/productAdmin");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Cấu hình lưu file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    // tạo tên file duy nhất
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get(
  "/admin/products",
  authenticateToken,
  verifyRole(["admin"]),
  productAdminController.getProducts
);

router.get(
  "/admin/products/product/:productId",
  productAdminController.getProductById
);

router.post(
  "/admin/products/add-product",
  authenticateToken,
  verifyRole(["admin"]),
  upload.array("images"),
  productAdminController.postAddProduct
);

router.patch(
  "/admin/products/update-product/:productId",
  authenticateToken,
  verifyRole(["admin"]),
  upload.array("images"),
  productAdminController.updateProduct
);

router.delete(
  "/admin/products/delete-product/:productId",
  authenticateToken,
  verifyRole(["admin"]),
  upload.array("images"),
  productAdminController.deleteProduct
);

module.exports = router;

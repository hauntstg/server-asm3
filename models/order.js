const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  total_price: {
    type: Number,
    required: true,
  },
  delivery: {
    type: String,
    required: true,
    default: "Waiting for progressing",
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    required: true,
    default: "Waiting for pay",
  },
  payMethod: {
    type: String,
    required: true,
    default: "cash",
  },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

// Tạo model từ schema
const orderModel = mongoose.model("Order", orderSchema);

// Xuất model để sử dụng trong ứng dụng của bạn
module.exports = orderModel;

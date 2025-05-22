const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

// const emailTemplatePath = path.join(__dirname, "../utils/email-template.ejs");
// let template = fs.readFileSync(emailTemplatePath, "utf8");
// console.log(emailTemplatePath);
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    clientId:
      "280066269512-5cklkjiu44lk71qo7n0jrp211ktipvl3.apps.googleusercontent.com",
    clientSecret: "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",
    apiKey: "AIzaSyAl6Fiv3VFhFeeVEOcwDVg70ZKwhiDC9BQ",
    user: "nthau.it96@gmail.com",
    pass: "jlltrypmtsmcvapw",
  },
});

exports.postOrder = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();

    const { fullname, email, phone, address, userId, total_price, items } =
      req.body;
    const user = {};
    user.fullname = fullname;
    user.email = email;
    user.phone = phone;
    user.address = address;

    // update số lượng trong Product
    for (const item of items) {
      const product = await Product.findById(item.productId._id).session(
        session
      );
      // console.log(product);
      if (!product)
        throw new Error(`Sản phẩm ${item.productId._id} không tồn tại`);

      if (product.count < item.quantity) {
        throw new Error(`Không đủ hàng cho sản phẩm ${product._id.name}`);
      }

      // trừ số lượng
      product.count -= item.quantity;
      await product.save({ session });
    }

    // thêm mới 1 order
    const newOrder = new Order({ user, userId, total_price, items });
    await newOrder.save({ session });

    // xóa giỏ hàng trong user
    await User.findByIdAndUpdate(userId, {
      cart: [],
      new: true,
    }).session(session);

    // const emailTemplatePath = path.join(
    //   __dirname,
    //   "../utils/email-template.ejs"
    // );
    const emailTemplatePath = path.join(
      process.cwd(),
      "utils",
      "email-template.ejs"
    );
    // let template = fs.readFileSync(emailTemplatePath, "utf8");
    const htmlContent = await ejs.renderFile(emailTemplatePath, {
      fullname,
      phone,
      address,
      items,
      total_price,
    });

    transporter.sendMail({
      to: email,
      from: "ASM 3 NJS",
      subject:
        "Bạn đã đặt hàng thành công, đơn hàng đang chờ xử lý! - " +
        Date.now().toString(),
      html: htmlContent,
    });
    res.status(200).json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.log(error);
  }
};

exports.getOrdersByUser = async (req, res, next) => {
  const { userId } = req.params;
  const orders = await Order.find({ userId });
  res.status(200).json(orders);
};

exports.getOrderDetail = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.find({ _id: orderId }).populate("items.productId");
  res.status(200).json(order);
};

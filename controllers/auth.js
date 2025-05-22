const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const fullName = req.body.fullname;
  const password = req.body.password;
  const phone = req.body.phone;
  const hash = await bcrypt.hash(password, 10);
  // console.log(email, fullName, password, phone);
  try {
    const userList = await User.find();
    if (userList.find((u) => u.email === email)) {
      console.log();
      res.status(409).json({ error: "Email already exists" });
    } else {
      const user = await User.create({
        fullName,
        email,
        password: hash,
        phone,
      });
      res.json({ message: "User registered" });
    }
  } catch (err) {
    res.status(400).json({ error: "Username taken" });
  }
};

exports.signin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log(email, password);
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Email không tồn tại" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Mật khẩu không chính xác" });
  }
  req.session.userId = user._id;
  // res.status(200).json({ message: "Đăng nhập thành công", data: user });
  req.session.save((err) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi tạo session" });
    }
    res.status(200).json({ message: "Đăng nhập thành công", data: user });
  });
};

exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Đã đăng xuất" });
  });
};

// Lấy thông tin người dùng
exports.getProfile = async (req, res, next) => {
  // if (!req.session.userId) {
  //   return res.status(401).json({ message: "Chưa đăng nhập" });
  // }

  const user = await User.findById(req.session.userId).populate(
    "cart.productId"
  );
  // console.log(user);
  res.status(200).json({
    _id: user._id,
    fullname: user.fullName,
    email: user.email,
    cart: user.cart,
    phone: user.phone,
  });
};

// Lấy thông tin người dùng
exports.getUser = async (req, res, next) => {
  const { userId } = req.params;
  console.log(userId);
  const user = await User.findById(userId).populate("cart.productId");
  // res.status(200).json(user);
  res.status(200).json({
    _id: user._id,
    fullname: user.fullName,
    email: user.email,
    cart: user.cart,
  });
};

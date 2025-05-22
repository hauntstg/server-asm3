const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const SECRET = "supersecret";

exports.signin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Email không tồn tại" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Mật khẩu không chính xác" });
  }
  const token = jwt.sign(
    { userId: user._id.toString(), role: user.role },
    SECRET,
    { expiresIn: "1h" }
  );
  res.status(200).json({
    token,
    userId: user._id.toString(),
    role: user.role || "customer",
  });
};

exports.checkToken = (req, res, next) => {
  res.status(200).json({ message: "Xác thực token thành công!" });
};

exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Đã đăng xuất" });
  });
};

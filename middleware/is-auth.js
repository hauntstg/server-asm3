const jwt = require("jsonwebtoken");
const SECRET = "supersecret";

exports.requireSession = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // const authHeader = req.get("Authorization");
  if (!authHeader)
    return res.status(401).json("Không có Authorization header!");

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json("Token sai hoặc đã hết hạn!"); // Token sai hoặc hết hạn
  }
};

exports.verifyRole = (roles = []) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    // console.log(userRole);

    if (roles.includes(userRole)) {
      return next();
    }

    res
      .status(403)
      .json({ message: "Bạn không có quyền Quản trị để truy cập!" });
  };
};

const User = require("../../models/user");
const Order = require("../../models/order");

exports.getDashboard = async (req, res, next) => {
  // số lượng cusomer
  const customerCount = (await User.find({ role: "customer" })).length;

  // tổng doanh thu tháng hiện tại
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const endOfMonth = new Date(
    startOfMonth.getFullYear(),
    startOfMonth.getMonth() + 1,
    0
  );
  endOfMonth.setHours(23, 59, 59, 999);

  const earningsOfMonth = (
    await Order.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    })
  ).reduce((sum, currentOrder) => sum + currentOrder.total_price, 0);

  // các orders gần đây (lấy các orders trong 7 ngày qua)
  const now = new Date();
  const start7DaysAgo = new Date();
  start7DaysAgo.setDate(now.getDate() - 6); // Bao gồm cả hôm nay
  start7DaysAgo.setHours(0, 0, 0, 0);
  const endNow = new Date();
  endNow.setHours(23, 59, 59, 999);

  const recentOrders = (
    await Order.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    })
  ).length;

  res.status(200).json({ customerCount, earningsOfMonth, recentOrders });
};

exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Đã đăng xuất" });
  });
};

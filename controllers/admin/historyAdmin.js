const Order = require("../../models/order");

exports.getHistory = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 4;
  const totalItems = await Order.countDocuments();
  const totalPages = Math.ceil(totalItems / perPage);
  const fromIndex = (currentPage - 1) * perPage + 1;
  const toIndex = Math.min(currentPage * perPage, totalItems);
  const orders = await Order.find()
    .skip((currentPage - 1) * perPage)
    .limit(perPage);
  res
    .status(200)
    .json({ orders, totalItems, perPage, totalPages, fromIndex, toIndex });
};

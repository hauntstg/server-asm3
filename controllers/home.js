const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const { category, name } = req.query;

    const filter = {};
    console.log(category);
    if (category) {
      filter.category = category;
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
};

exports.getProduct = async (req, res, next) => {
  const { productId } = req.params;
  const products = await Product.find({ _id: productId });
  // console.log(products);
  res.status(200).json(products);
};

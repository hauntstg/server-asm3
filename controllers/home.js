const Product = require("../models/product");

exports.getProductList = async (req, res, next) => {
  try {
    const { category, name, page } = req.query;

    const filter = {};
    console.log(category + " " + name + " " + page);
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

exports.getProducts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const name = req.query.name || "";
    const category = req.query.category;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const perPage = 9;
    const totalItems = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / perPage);
    const fromIndex = (currentPage - 1) * perPage + 1;
    const toIndex = Math.min(currentPage * perPage, totalItems);

    const products = await Product.find(filter)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    // console.log(products.length);
    console.log(
      "c: " + category,
      "n: " + name,
      totalPages,
      fromIndex,
      toIndex,
      totalItems
    );
    res.status(200).json({
      products,
      pagination: {
        totalItems,
        perPage,
        totalPages,
        fromIndex,
        toIndex,
        currentPage,
      },
    });
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

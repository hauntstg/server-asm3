const Product = require("../../models/product");
const io = require("../../socket");

exports.getProducts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const name = req.query.name || "";

  const perPage = 4;
  const totalItems = await Product.countDocuments({
    name: { $regex: name, $options: "i" },
  });
  const totalPages = Math.ceil(totalItems / perPage);
  const fromIndex = (currentPage - 1) * perPage + 1;
  const toIndex = Math.min(currentPage * perPage, totalItems);

  const products = await Product.find({
    name: { $regex: name, $options: "i" }, // tìm tên có chứa searchName, không phân biệt hoa thường
  })
    .sort({ _id: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage);
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
};

exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ _id: productId });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { ...product } = req.body;
    const updateProd = await Product.findByIdAndUpdate(productId, product, {
      new: true,
    });

    if (!updateProd) {
      return res.status(404).json({ message: "Product not found" });
    }
    io.getIO().emit("productUpdated", {
      updateProd,
    });
    res.status(200).json({ message: "Cập nhật sản phẩm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { shortDesc, longDesc, ...product } = req.body;
    const imageUrls = req.files.map((f) => f.path.replace("\\", "/"));
    product.short_desc = shortDesc;
    product.long_desc = longDesc;
    imageUrls.map((img, index) => (product["img" + (index + 1)] = img));
    // console.log(product);
    const newProduct = new Product(product);
    await newProduct.save();
    io.getIO().emit("productCreated", {
      newProduct,
    });

    res.status(200).json({ message: "Tạo sản phẩm thành công!", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    await Product.findByIdAndDelete(productId);
    io.getIO().emit("productDeleted", {
      productId: productId,
    });
    return res.status(200).json({ message: "Sản phẩm đã được xoá!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

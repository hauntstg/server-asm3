const User = require("../models/user");

exports.updateAddToCart = async (req, res, next) => {
  try {
    const { productId, quantity, user } = req.body;
    // console.log(productId, quantity, user);
    const u = await User.findOne({ _id: user._id });
    const findIndexInCart = u.cart.findIndex(
      (c) => c.productId.toString() === productId
    );
    // console.log(findIndexInCart);
    let newCart = [...u.cart];
    if (findIndexInCart < 0) {
      newCart.push({ productId, quantity });
      // const newCart = [...u.cart, { productId, quantity }];
    } else {
      // const currQuantity = newCart[findIndexInCart].quantity;
      newCart[findIndexInCart].quantity += quantity;
    }

    await User.findByIdAndUpdate(user._id, {
      $set: {
        cart: newCart,
      },
    });
    res.status(200).json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.log(error);
  }
};

exports.updateCart = async (req, res, next) => {
  const { cartToUpdate, user } = req.body;
  await User.findByIdAndUpdate(user._id, {
    $set: {
      cart: cartToUpdate,
    },
  });
  res.status(200).json({ message: "Cập nhật thành công!" });
};

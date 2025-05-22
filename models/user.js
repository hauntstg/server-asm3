const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: false },
  phone: { type: String, required: false },
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number },
    },
  ],
  role: {
    type: String,
    enum: ["customer", "support", "admin"],
    default: "customer",
  },
  // isAdmin: { type: Boolean, required: false },
});

module.exports = mongoose.model("User", userSchema);

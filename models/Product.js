const mongoose = require("mongoose");

let ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  discountPrice: Number,
  category: String,
  description: String,
  currency: { type: mongoose.Schema.Types.String, default: "euro" },
  image: String,
  created_on: { type: mongoose.Schema.Types.Date, default: new Date() },
  modified_on: { type: mongoose.Schema.Types.Date, default: new Date() },
  isTopProduct: { type: mongoose.Schema.Types.Boolean, default: false },
});
mongoose.model("Product", ProductSchema);
module.exports = mongoose.model("Product");

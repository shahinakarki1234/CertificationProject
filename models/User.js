const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  role: { type: mongoose.Schema.Types.String, default: "customer" },
  image: String,
  address: {
    streetAddress: String,
    city: String,
    state: String,
    zipcode: String,
  },
  products: Array,
});
mongoose.model("User", UserSchema);
module.exports = mongoose.model("User");

const mongoose = require("mongoose");

let User = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  roles: Array,
  profileImage: String,
  address: {
    streetAddress: String,
    city: String,
    state: String,
    zipcode: String,
  },
});

module.exports = User;

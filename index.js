const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 8080;

const userController = require("./user/userController");
app.use("/api/v1/users", userController);

const profileController = require("./profile/profileController");
app.use("/api/v1/profile", profileController);

const homepageController = require("./homepage/homepageController");
app.use("/api/v1/homepage", homepageController);

mongoose
  .connect("mongodb://localhost:27017/shop247", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((success) => {
    console.log("Connected to MongoDB!");

    //server listen on port
    app.listen(port, (err) => {
      if (err) {
        console.log("Error : " + err);
      } else {
        console.log(`Server up and running on port ${port}`);
      }
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDb!" + err);
  });

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

const authController = require("./auth/authController");
app.use("/api/v1", authController);

mongoose
  .connect("mongodb://localhost:27017/datahere", {
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

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const config = require("../config");
const User = require("../models/User");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({
      status: "failed",
      message: "Please pass email and password",
    });
    return;
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.create(
    {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
    },
    (err, user) => {
      if (err)
        return res
          .status(500)
          .send(`There was an error registering a user ${err}`);

      //else return token

      const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400, //secs
      });
      res.status(200).send({
        status: "success",
        message: "user created successfully",
        accessToken: token,
      });
    }
  );
});

router.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({
      status: "failed",
      message: "Please pass email and password",
    });
    return;
  }

  User.findOne(
    {
      email: req.body.email,
    },
    (err, user) => {
      if (err) return res.status(500).send(`Error while logging in ${err}`);

      if (!user) {
        return res.status(404).send(`User not found`);
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid)
        return res.status(401).send({
          auth: false,
          accessToken: null,
          message: "password isn't valid",
        });
      //else return token
      const token = jwt.sign({ _id: user._id }, config.secret, {
        expiresIn: 86400, //secs
      });
      res.status(200).send({
        status: "success",
        message: "user logged in successfully",
        accessToken: token,
      });
    }
  );
});

module.exports = router;

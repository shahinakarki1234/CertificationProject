const express = require("express");
const jwt = require("jwt");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const config = require("../config");
const User = require("../models/User");
const checkLoggedIn = require("./authMiddleware");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/users/register", (req, res) => {
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

router.post("/users/login", (req, res) => {
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
        message: "user loggein successfully",
        accessToken: token,
      });
    }
  );
});

router.get("/profile", checkLoggedIn, (req, res) => {
  User.findById(req.user.id, { password: 0 }, (err, user) => {
    if (err) return res.status(500).send(`problem finding the user ${err}`);

    if (!user) {
      return res.status(404).send(`User not found`);
    }
    res.status(200).send({
      status: "success",
      profile: user,
    });
  });
});

router.delete("/profile/:field", checkLoggedIn, (req, res) => {
  User.updateOne(
    { _id: req.user.id },
    { $unset: { [req.params.field]: "" } },
    (err, user) => {
      if (err) return res.status(500).send(`problem finding the user ${err}`);

      if (!user) {
        return res.status(404).send(`User not found`);
      }
      res.status(200).send({
        status: "success",
        message: `profile ${req.params.field} deleted successfully`,
      });
    }
  );
});

router.patch("/profile/:field", checkLoggedIn, (req, res) => {
  User.updateOne(
    { _id: req.user.id },
    { $set: { [req.params.field]: req.body[req.params.field] } },
    (err, user) => {
      if (err) return res.status(500).send(`problem finding the user ${err}`);

      if (!user) {
        return res.status(404).send(`User not found`);
      }
      res.status(200).send({
        status: "success",
        message: `profile ${req.params.field} updated successfully`,
      });
    }
  );
});

router.get("/", (req, res) => {
  User.find({}, (err, users) => {
    if (err)
      return res.status(500).send(`There was an error getting users ${err}`);
    res.status(200).send(users);
  });
});

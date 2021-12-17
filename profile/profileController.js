const express = require("express");
const bodyParser = require("body-parser");

const User = require("../models/User");
const checkLoggedIn = require("../authMiddleware");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", checkLoggedIn, (req, res) => {
  User.findById(req.user._id, { password: 0 }, (err, user) => {
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

router.delete("/image", checkLoggedIn, (req, res) => {
  User.updateOne(
    { _id: req.user._id },
    { $unset: { image: "" } },
    (err, user) => {
      if (err) return res.status(500).send(`problem finding the user ${err}`);

      if (!user) {
        return res.status(404).send(`User not found`);
      }
      res.status(200).send({
        status: "success",
        message: `profile image deleted successfully`,
      });
    }
  );
});

router.patch("/:field", checkLoggedIn, (req, res) => {
  const field = req.params.field;
  if (req.body && req.body.profile && req.body.profile[field]) {
    if (field === "email") {
      res.status(403).send({
        status: "failed",
        message: "Sorry, email isn't allowed to be edited",
      });
      return;
    }
    if (field === "address" && typeof field !== "object" && !field) {
      res.status(400).send({
        status: "failed",
        message: "Please pass valid address with subfields",
      });
      return;
    }
    User.updateOne(
      { _id: req.user._id },
      { $set: { [field]: req.body.profile[field] } },
      (err, user) => {
        if (err) return res.status(500).send(`problem finding the user ${err}`);

        if (!user) {
          return res.status(404).send(`User not found`);
        }
        res.status(200).send({
          status: "success",
          message: `profile ${field} updated successfully`,
        });
      }
    );
  } else {
    res.status(400).send({
      status: "failed",
      message: "Please pass correct data in body",
    });
  }
});

module.exports = router;

const express = require("express");
const bodyParser = require("body-parser");

const Product = require("../models/Product");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});

    if (!products || !products.length) {
      res.status(404).send(`products not found`);
      return;
    }

    res.status(200).send({
      status: "success",
      products,
    });
  } catch (error) {
    res.status(500).send(`There was an error getting all products ${error}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    //get random products
    const product = await Product.findOne({ id: req.params.id });

    if (!product) {
      res.status(404).send(`product for given id not found`);
      return;
    }

    res.status(200).send({
      status: "success",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .send(`There was an error getting product ${req.params.id} ${error}`);
  }
});

router.post("/admin/products", async (req, res) => {
  try {
    //get random products
    const product = await Product.create(req.body.product);

    if (!product) {
      res.status(404).send(`created product not found`);
      return;
    }

    res.status(200).send({
      status: "success",
      product,
    });
  } catch (error) {
    res.status(500).send(`There was an error creating a product ${error}`);
  }
});

module.exports = router;

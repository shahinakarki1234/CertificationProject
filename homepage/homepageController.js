const express = require("express");
const bodyParser = require("body-parser");

const Product = require("../models/Product");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/banner", async (req, res) => {
  try {
    const products = await Product.find({}, { image: 1, name: 1 })
      .sort({ created_on: -1 })
      .limit(3);

    if (!products || !products.length) {
      res.status(404).send(`products not found`);
      return;
    }

    res.status(200).send({
      status: "success",
      products,
    });
  } catch (error) {
    res.status(500).send(`There was an error getting banners ${error}`);
  }
});

router.get("/categories", async (req, res) => {
  try {
    //get random products
    const products = await Product.find({}, { category: 1 }).limit(3);

    if (!products || !products.length) {
      res.status(404).send(`product categories not found`);
      return;
    }

    //loop products
    const categories = products.map((product) => {
      return {
        name: product.category,
      };
    });

    res.status(200).send({
      status: "success",
      categories,
    });
  } catch (error) {
    res
      .status(500)
      .send(`There was an error getting random 3 categories ${error}`);
  }
});

router.get("/products", async (req, res) => {
  try {
    //get random products
    const products = await Product.find({}).limit(8);

    if (!products || !products.length) {
      res.status(404).send(`product categories not found`);
      return;
    }

    res.status(200).send({
      status: "success",
      products,
    });
  } catch (error) {
    res
      .status(500)
      .send(`There was an error getting random 8 products ${error}`);
  }
});

module.exports = router;

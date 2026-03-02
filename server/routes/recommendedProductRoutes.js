const express = require("express");
const router = express.Router();
const RecommendedProduct = require("../models/RecommendedProduct");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const recommendedProducts = await RecommendedProduct.find();
    res.json(recommendedProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trendings products" });
  }
});

module.exports = router;
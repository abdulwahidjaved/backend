const express = require("express");
const router = express.Router();
const TrendingProduct = require("../models/TrendingProduct");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const trendingProducts = await TrendingProduct.find();
    res.json(trendingProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trendings products" });
  }
});

module.exports = router;
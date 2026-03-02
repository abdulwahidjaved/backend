const express = require("express");
const router = express.Router();
const AllProduct = require("../models/AllProduct");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const allproducts = await AllProduct.find();
    res.json(allproducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all products" });
  }
});

// GET all product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await AllProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
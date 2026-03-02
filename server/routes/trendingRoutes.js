const express = require("express");
const router = express.Router();
const Trending = require("../models/Trending");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const trendings = await Trending.find();
    res.json(trendings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trendings" });
  }
});

module.exports = router;
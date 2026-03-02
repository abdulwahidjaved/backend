const mongoose = require("mongoose");

const trendingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  discount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Trending", trendingSchema);
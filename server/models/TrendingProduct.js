const mongoose = require("mongoose");

const trendingProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  image: { type: String, required: true },
});

module.exports = mongoose.model("TrendingProduct", trendingProductSchema);
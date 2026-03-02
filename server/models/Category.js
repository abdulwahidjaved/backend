const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  bgColor: { type: String, default: "bg-gray-100" },
});

module.exports = mongoose.model("Category", categorySchema);
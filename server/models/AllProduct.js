// const mongoose = require("mongoose");

// const allProductSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     price: { type: Number, default: 0 },
//     category: { type: String, required: true },
//     image: { type: String, required: true },
//     description: { type: String, required: true },
//     qty: { type: Number, default: 0 },
//     val: { type: String, default: "" },
// });

// module.exports = mongoose.model("AllProduct", allProductSchema);
const mongoose = require("mongoose");

const allProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    category: String,
    image: String,
    description: String,
    val: String,
    qty: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("AllProduct", allProductSchema);
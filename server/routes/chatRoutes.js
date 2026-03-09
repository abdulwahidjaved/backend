const express = require("express");
const router = express.Router();

const AllProduct = require("../models/AllProduct");
const Order = require("../models/Order");

/* ======================================
   CHAT ROUTE
====================================== */

router.post("/", async (req, res) => {
  try {

    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message required"
      });
    }

    const text = message.toLowerCase();

    /* ======================================
       PRODUCT SEARCH
    ====================================== */

    if (
      text.includes("cheap") ||
      text.includes("medium") ||
      text.includes("high") ||
      text.includes("product") ||
      text.includes("watch")
    ) {

      let filter = {};

      /* PRICE LEVEL FILTER */

      if (text.includes("cheap")) {
        filter.val = "Cheap";
      }

      if (text.includes("medium")) {
        filter.val = "Medium";
      }

      if (text.includes("high")) {
        filter.val = "High";
      }

      /* CATEGORY FILTER */

      if (text.includes("watch")) {
        filter.name = { $regex: "watch", $options: "i" };
      }

      const products = await AllProduct.find(filter).limit(5);

      if (products.length === 0) {
        return res.json({
          success: true,
          message: "No matching products found."
        });
      }

      const productList = products.map(p => {

        const stock = p.qty > 0 ? "In Stock" : "Out of Stock";

        return `
🛍 ${p.name}
💰 ₹${p.price}
📦 ${stock}
🔗 http://localhost:3000/products/${p._id}
`;
      }).join("\n");

      return res.json({
        success: true,
        message: `Here are some products:\n${productList}`
      });
    }

    /* ======================================
       ORDER TRACKING
    ====================================== */

    if (
      text.includes("track") ||
      text.includes("order") ||
      text.includes("status")
    ) {

      console.log("UserId received:", userId);

      if (!userId) {
        return res.json({
          success: true,
          message: "Please login to check your order status."
        });
      }

      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

      if (orders.length === 0) {
        return res.json({
          success: true,
          message: "You have no orders yet."
        });
      }

      const orderText = orders.map(order => {

        const items = order.products.map(p => p.name).join(", ");

        return `
📦 Order ID: ${order._id}
🛍 Items: ${items}
💳 Payment Status: ${order.paymentStatus}
`;

      }).join("\n");

      return res.json({
        success: true,
        message: `Your orders:\n${orderText}`
      });
    }

    /* ======================================
       DEFAULT RESPONSE
    ====================================== */

    return res.json({
      success: true,
      message:
        "You can ask things like:\n\n" +
        "• show cheap products\n" +
        "• show medium watches\n" +
        "• track my order"
    });

  } catch (error) {

    console.error("Chat error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
});

module.exports = router;
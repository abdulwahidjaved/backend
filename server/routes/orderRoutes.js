const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/AllProduct"); // IMPORTANT


/* ===============================
   CREATE DB ORDER (Pending)
================================ */
router.post("/create-order", async (req, res) => {
  try {

    const { userId, products, totalAmount } = req.body;

    console.log("Incoming products:", products);

    if (!userId || !products || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    /*
      products example from frontend:
      [
        { productId: "123", quantity: 2 },
        { productId: "456", quantity: 1 }
      ]
    */

    // 🔹 Deduct product stock
    for (const item of products) {

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.qty < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}`,
        });
      }

      // Deduct quantity
      product.qty -= item.quantity;

      await product.save();
    }

    // 🔹 Create order
    const newOrder = await Order.create({
      user: userId,
      products,
      totalAmount,
      paymentStatus: "Pending",
    });

    // 🔹 Push order ID inside user document
    await User.findByIdAndUpdate(userId, {
      $push: { orders: newOrder._id },
    });

    res.status(201).json({
      success: true,
      order: newOrder,
    });

  } catch (error) {

    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});


/* ===============================
   GET ALL USER ORDERS
================================ */
router.get("/user/:userId", async (req, res) => {
  try {

    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    console.error("Fetch Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });

  }
});

module.exports = router;
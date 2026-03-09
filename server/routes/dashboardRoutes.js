const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/AllProduct");
const User = require("../models/User");

const {
  getDashboardStats,
  getRecentOrders,
  getLowStockProducts
} = require("../models/Dashboard");


/*
--------------------------------
Dashboard Stats
--------------------------------
*/
router.get("/stats", async (req, res) => {
  try {

    const stats = await getDashboardStats();
    res.json(stats);

  } catch (error) {

    console.error("Stats Route Error:", error);

    res.status(500).json({
      message: "Error fetching stats"
    });

  }
});


/*
--------------------------------
Orders Section
--------------------------------
*/

// Get all orders
router.get("/orders", async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    console.error("Orders Error:", error);

    res.status(500).json({
      message: "Error fetching orders"
    });

  }
});


// Get single order
router.get("/orders/:id", async (req, res) => {
  try {

    const order = await Order.findById(req.params.id)
      .populate("user", "name email");

    res.json(order);

  } catch (error) {

    console.error("Order Error:", error);

    res.status(500).json({
      message: "Error fetching order"
    });

  }
});


/*
--------------------------------
Create Order (Deduct Product Qty)
--------------------------------
*/

router.post("/create-order", async (req, res) => {
  try {

    const { userId, products, totalAmount } = req.body;

    if (!userId || !products || !totalAmount) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // Deduct product quantity
    for (let item of products) {

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      if (product.qty < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`
        });
      }

      product.qty = product.qty - item.quantity;
      await product.save();
    }

    const newOrder = await Order.create({
      user: userId,
      products,
      totalAmount,
      paymentStatus: "Pending"
    });

    await User.findByIdAndUpdate(userId, {
      $push: { orders: newOrder._id }
    });

    res.status(201).json(newOrder);

  } catch (error) {

    console.error("Create Order Error:", error);

    res.status(500).json({
      message: "Error creating order"
    });

  }
});


/*
--------------------------------
Products Section
--------------------------------
*/

// Get all products
router.get("/products", async (req, res) => {
  try {

    const products = await Product.find()
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {

    console.error("Products Error:", error);

    res.status(500).json({
      message: "Error fetching products"
    });

  }
});


/*
Create Product
*/
router.post("/products", async (req, res) => {
  try {

    const {
      name,
      price,
      category,
      image,
      description,
      val,
      qty
    } = req.body;

    const product = await Product.create({
      name,
      price,
      category,
      image,
      description,
      val,
      qty
    });

    res.json(product);

  } catch (error) {

    console.error("Create Product Error:", error);

    res.status(500).json({
      message: "Error creating product"
    });

  }
});


/*
Update Product
*/
router.put("/products/:id", async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(product);

  } catch (error) {

    console.error("Update Product Error:", error);

    res.status(500).json({
      message: "Error updating product"
    });

  }
});


// Delete product
router.delete("/products/:id", async (req, res) => {
  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted"
    });

  } catch (error) {

    console.error("Delete Product Error:", error);

    res.status(500).json({
      message: "Error deleting product"
    });

  }
});


/*
--------------------------------
Users Section
--------------------------------
*/

// Get all users
router.get("/users", async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {

    console.error("Users Error:", error);

    res.status(500).json({
      message: "Error fetching users"
    });

  }
});


/*
--------------------------------
Extra APIs
--------------------------------
*/

// recent orders
router.get("/recent-orders", async (req, res) => {
  try {

    const orders = await getRecentOrders();
    res.json(orders);

  } catch (error) {

    console.error("Recent Orders Error:", error);

    res.status(500).json({
      message: "Error fetching recent orders"
    });

  }
});


// low stock products
router.get("/low-stock", async (req, res) => {
  try {

    const products = await getLowStockProducts();
    res.json(products);

  } catch (error) {

    console.error("Low Stock Error:", error);

    res.status(500).json({
      message: "Error fetching low stock products"
    });

  }
});

module.exports = router;
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const trendingRoutes = require("./routes/trendingRoutes");
const trendingProductRoutes = require("./routes/trendingProductRoutes");
const recommendedProductRoutes = require("./routes/recommendedProductRoutes");
const allProductRoutes = require("./routes/allproductRoutes");
const authRoutes = require("./routes/auth")

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/categories", categoryRoutes);
app.use("/api/trendings", trendingRoutes);
app.use("/api/trendingProducts", trendingProductRoutes);
app.use("/api/recommendedProducts", recommendedProductRoutes);
app.use("/api/allProducts", allProductRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", require("./routes/payment"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
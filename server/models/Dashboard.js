const Order = require("./Order");
const Product = require("./AllProduct");
const User = require("./User");

/*
--------------------------------
Dashboard Stats
--------------------------------
*/
exports.getDashboardStats = async () => {
  try {

    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find();

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.total || order.totalPrice || 0);
    }, 0);

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue
    };

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    throw error;
  }
};


/*
--------------------------------
Recent Orders
--------------------------------
*/
exports.getRecentOrders = async () => {
  try {

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    return orders;

  } catch (error) {
    console.error("Recent Orders Error:", error);
    throw error;
  }
};


/*
--------------------------------
Low Stock Products
--------------------------------
*/
exports.getLowStockProducts = async () => {
  try {

    const products = await Product.find({
      qty: { $lt: 5 }
    });

    return products;

  } catch (error) {
    console.error("Low Stock Error:", error);
    throw error;
  }
};
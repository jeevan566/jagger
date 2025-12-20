const RFQ = require("../models/RFQ");
const Quote = require("../models/Quote");
const PO = require("../models/PO");
const User = require("../models/User");
const Product = require("../models/Product");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalRFQs = await RFQ.countDocuments();
    const totalQuotes = await Quote.countDocuments();
    const totalPOs = await PO.countDocuments();
    const totalSuppliers = await User.countDocuments({ role: "supplier" });
    const totalProducts = await Product.countDocuments();

    // Monthly PO Spend Graph (last 6 months)
    const last6Months = await PO.aggregate([
      {
        $group: {
          _id: { $substr: ["$createdAt", 0, 7] }, // YYYY-MM
          totalAmount: { $sum: { $sum: "$items.total" } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalRFQs,
      totalQuotes,
      totalPOs,
      totalSuppliers,
      totalProducts,
      last6Months,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

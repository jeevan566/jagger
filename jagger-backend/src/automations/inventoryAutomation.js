const Inventory = require("../models/Inventory");
const User = require("../models/User");
const RFQ = require("../models/RFQ");
const { sendEmail } = require("../utils/sendEmail");
const { createNotification } = require("../utils/createNotification");

exports.checkLowInventory = async () => {
  try {
    console.log("📦 Checking inventory levels...");

    const lowStockItems = await Inventory.find({
      $expr: { $lte: ["$quantity", "$minStock"] },
    }).populate("productId");

    if (lowStockItems.length === 0) {
      console.log("✅ Inventory levels are healthy");
      return;
    }

    // Find admins & managers
    const users = await User.find({
      role: { $in: ["admin", "manager"] },
    });

    for (const item of lowStockItems) {
      for (const user of users) {
        // Notification
        await createNotification(
          user._id,
          `Low stock alert: ${item.productId.name}`
        );

        // Email
        await sendEmail(
          user.email,
          "Low Inventory Alert",
          `
            <h3>Low Stock Alert</h3>
            <p>Product: <b>${item.productId.name}</b></p>
            <p>Current Stock: ${item.quantity}</p>
            <p>Minimum Stock: ${item.minStock}</p>
          `
        );
      }

      console.log(`⚠ Low stock alert sent for ${item.productId.name}`);
    }
  } catch (err) {
    console.error("Inventory Automation Error:", err.message);
  }
};

exports.autoGenerateRFQ = async () => {
  try {
    console.log("📝 Checking for auto RFQ generation...");

    const criticalItems = await Inventory.find({
      quantity: { $lte: 5 }, // critical threshold
    }).populate("productId");

    if (criticalItems.length === 0) {
      console.log("✅ No critical inventory items");
      return;
    }

    const rfqCount = await RFQ.countDocuments();
    const rfqNumber = "AUTO-RFQ-" + (rfqCount + 1);

    const rfq = await RFQ.create({
      rfqNumber,
      title: "Auto Generated RFQ (Low Inventory)",
      notes: "System generated RFQ due to low stock",
      suppliers: [], // admin will assign suppliers
      status: "draft",
    });

    console.log(`📄 Auto RFQ created: ${rfq.rfqNumber}`);
  } catch (err) {
    console.error("Auto RFQ Error:", err.message);
  }
};

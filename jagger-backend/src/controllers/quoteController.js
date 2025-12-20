const Quote = require("../models/Quote");
const RFQ = require("../models/RFQ");
const RFQItem = require("../models/RFQItem");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");
const { logActivity } = require("../utils/logActivity");
const { createNotification } = require("../utils/createNotification");

// Supplier RFQ list
exports.getSupplierRFQs = async (req, res) => {
  try {
    const supplierUserId = req.user.id;

    const rfqs = await RFQ.find({
      suppliers: supplierUserId, // <--- this line is correct
      status: "published",
    }).select("rfqNumber title status");

    res.json(rfqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch RFQ items for supplier to quote
exports.getRFQItems = async (req, res) => {
  try {
    const items = await RFQItem.find({ rfqId: req.params.id }).populate(
      "productId",
      "name unit"
    );

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit quote
exports.submitQuote = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const rfqId = req.params.id;
    const { items, notes } = req.body;

    // 1. Create Quote
    const quote = await Quote.create({
      rfqId,
      supplierId,
      items,
      notes,
      status: "submitted",
      submittedAt: new Date(),
    });

    // 2. Log activity
    await logActivity(
      supplierId,
      "QUOTE_SUBMITTED",
      `RFQ: ${rfqId}`
    );

    // 3. Notify all admins
    const admins = await User.find({ role: "admin" });

    for (let admin of admins) {
      // In-app notification
      await createNotification(
        admin._id,
        `New quote submitted by ${req.user.name}`
      );

      // Email notification
      await sendEmail(
        admin.email,
        "Supplier Submitted a Quote",
        `
          <h2>A supplier has submitted a quote</h2>
          <p><strong>RFQ ID:</strong> ${rfqId}</p>
          <p><strong>Supplier:</strong> ${req.user.name}</p>
          <p>Please login to review and compare quotes.</p>
        `
      );
    }

    // 4. Send response LAST
    res.json({
      message: "Quote submitted successfully",
      quote,
    });

  } catch (err) {
    console.error("Submit Quote Error:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.getQuotesForRFQ = async (req, res) => {
  try {
    const rfqId = req.params.id;

    // 1. Get all quotes submitted for this RFQ
    const quotes = await Quote.find({ rfqId })
      .populate("supplierId", "name email")
      .populate("items.rfqItemId");

    // 2. Get RFQ Items (for product info)
    const rfqItems = await RFQItem.find({ rfqId }).populate(
      "productId",
      "name unit"
    );

    res.json({ quotes, rfqItems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

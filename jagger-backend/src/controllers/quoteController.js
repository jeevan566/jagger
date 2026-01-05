const Quote = require("../models/Quote");
const RFQ = require("../models/RFQ");
const RFQItem = require("../models/RFQItem");
const User = require("../models/User");
const Supplier = require("../models/Supplier");
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

// exports.submitQuote = async (req, res) => {
//   try {
//     const supplierId = req.user.id;
//     const rfqId = req.params.id;
//     const { items, notes } = req.body;

//     const quote = await Quote.create({
//       rfqId,
//       supplierId,
//       items,
//       notes,
//       status: "submitted",
//       submittedAt: new Date(),
//     });

//     await logActivity(supplierId, "QUOTE_SUBMITTED", `RFQ: ${rfqId}`);

//     // ✅ FIX: get supplier details properly
//     const supplier = await User.findById(supplierId).select("name email");
//     const supplierName = supplier?.name || supplier?.email || "Supplier";

//     const admins = await User.find({ role: "admin" });

//     for (let admin of admins) {
//       await createNotification(
//         admin._id,
//         `New quote submitted by ${supplierName}`
//       );

//       await sendEmail(
//         admin.email,
//         "Supplier Submitted a Quote",
//         `
//           <h2>New Quote Submitted</h2>
//           <p><strong>RFQ ID:</strong> ${rfqId}</p>
//           <p><strong>Supplier:</strong> ${supplierName}</p>
//           <p>Please login to review and compare quotes.</p>
//         `
//       );
//     }

//     res.json({ message: "Quote submitted successfully", quote });
//   } catch (err) {
//     console.error("Submit Quote Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
// Submit quote (SUPPLIER CAN SUBMIT ONLY ONCE PER RFQ)
exports.submitQuote = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const rfqId = req.params.id;
    const { items, notes } = req.body;

    // 🔒 NEW FIX: Check if supplier already submitted a quote for this RFQ
    const existingQuote = await Quote.findOne({
      rfqId,
      supplierId,
    });

    if (existingQuote) {
      return res.status(400).json({
        message: "You have already submitted a quote for this RFQ",
      });
    }

    // ✅ Allow first-time submission
    const quote = await Quote.create({
      rfqId,
      supplierId,
      items,
      notes,
      status: "submitted",
      submittedAt: new Date(),
    });

    await logActivity(supplierId, "QUOTE_SUBMITTED", `RFQ: ${rfqId}`);

    // Get supplier details
    const supplier = await User.findById(supplierId).select("name email");
    const supplierName = supplier?.name || supplier?.email || "Supplier";

    const admins = await User.find({ role: "admin" });

    for (let admin of admins) {
      await createNotification(
        admin._id,
        `New quote submitted by ${supplierName}`
      );

      await sendEmail(
        admin.email,
        "Supplier Submitted a Quote",
        `
          <h2>New Quote Submitted</h2>
          <p><strong>RFQ ID:</strong> ${rfqId}</p>
          <p><strong>Supplier:</strong> ${supplierName}</p>
          <p>Please login to review and compare quotes.</p>
        `
      );
    }

    res.json({ message: "Quote submitted successfully", quote });
  } catch (err) {
    console.error("Submit Quote Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getQuotesForRFQ = async (req, res) => {
  try {
    const rfqId = req.params.id;

    // 1. Get all quotes submitted for this RFQ
    // const quotes = await Quote.find({ rfqId })
    //   .populate("supplierId", "name email")
    // .populate("items.rfqItemId");
    const quotes = await Quote.find({ rfqId })
      .populate("supplierId", "name email")
      .populate({
        path: "items.rfqItemId",
        populate: {
          path: "productId",
          select: "name unit",
        },
      });

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

// Check if supplier already submitted quote for RFQ
exports.checkQuoteSubmitted = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const rfqId = req.params.id;

    const exists = await Quote.exists({ rfqId, supplierId });

    res.json({ submitted: !!exists });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

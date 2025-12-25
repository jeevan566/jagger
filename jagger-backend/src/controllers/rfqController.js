const RFQ = require("../models/RFQ");
const RFQItem = require("../models/RFQItem");
const User = require("../models/User");
const Supplier = require("../models/Supplier");
const { sendEmail } = require("../utils/sendEmail");
const { logActivity } = require("../utils/logActivity");
const { createNotification } = require("../utils/createNotification");

// Create RFQ
exports.createRFQ = async (req, res) => {
  try {
    const { title, notes, suppliers } = req.body;

    const rfqCount = await RFQ.countDocuments();
    const rfqNumber = "RFQ-" + (rfqCount + 1).toString().padStart(4, "0");

    const rfq = await RFQ.create({
      title,
      notes,
      suppliers,
      rfqNumber,
    });
    logActivity(req.user.id, "RFQ_CREATED", `RFQ: ${rfq.rfqNumber}`);

    res.json(rfq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add item to RFQ
exports.addItem = async (req, res) => {
  try {
    const { productId, quantity, unit } = req.body;

    const item = await RFQItem.create({
      rfqId: req.params.id,
      productId,
      quantity,
      unit,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get RFQ list
exports.getRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find().populate("suppliers", "name email");
    res.json(rfqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get RFQ details
exports.getRFQDetails = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id).populate(
      "suppliers",
      "name email"
    );

    const items = await RFQItem.find({ rfqId: req.params.id }).populate(
      "productId",
      "name unit"
    );

    res.json({ rfq, items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Publish RFQ
// exports.publishRFQ = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Update status
//     const rfq = await RFQ.findByIdAndUpdate(
//       id,
//       { status: "published" },
//       { new: true }
//     );

//     if (!rfq) {
//       return res.status(404).json({ message: "RFQ not found" });
//     }

//     // Send SINGLE response to client
//     res.json({
//       message: "RFQ published successfully",
//       rfq,
//     });
//     logActivity(req.user.id, "RFQ_PUBLISHED", `RFQ: ${rfq.rfqNumber}`);
//     createNotification(
//       supplierUser._id,
//       `You have been assigned RFQ ${rfq.rfqNumber}`
//     );

//     // Send email notifications AFTER response
//     rfq.suppliers.forEach(async (supplierId) => {
//       const supplierUser = await User.findById(supplierId);

//       if (supplierUser) {
//         sendEmail(
//           supplierUser.email,
//           `New RFQ Assigned: ${rfq.rfqNumber}`,
//           `
//           <h2>You have been assigned a new RFQ</h2>
//           <p>RFQ Number: ${rfq.rfqNumber}</p>
//           <p>Title: ${rfq.title}</p>
//           <p>Please login to submit your quotation.</p>
//         `
//         );
//       }
//     });
//   } catch (err) {
//     console.error("Publish RFQ Error:", err);

//     if (!res.headersSent) {
//       res.status(500).json({ message: err.message });
//     }
//   }
// };
// Publish RFQ
exports.publishRFQ = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Update RFQ status & populate suppliers (Users)
    const rfq = await RFQ.findByIdAndUpdate(
      id,
      { status: "published" },
      { new: true }
    ).populate("suppliers", "name email role");

    if (!rfq) {
      return res.status(404).json({ message: "RFQ not found" });
    }

    // 2️⃣ Activity log
    logActivity(req.user.id, "RFQ_PUBLISHED", `RFQ: ${rfq.rfqNumber}`);

    // 3️⃣ Notify + Email each supplier user
    for (const supplierUser of rfq.suppliers) {
      if (supplierUser.role === "supplier") {
        // Notification
        await createNotification(
          supplierUser._id,
          `You have been assigned RFQ ${rfq.rfqNumber}`
        );

        // Email
        await sendEmail(
          Supplier.email,
          `New RFQ Assigned: ${rfq.rfqNumber}`,
          `
            <h2>New RFQ Assigned</h2>
            <p><b>RFQ Number:</b> ${rfq.rfqNumber}</p>
            <p><b>Title:</b> ${rfq.title}</p>
            <p>Please login to submit your quotation.</p>
          `
        );
      }
    }

    // 4️⃣ Send response ONCE (after all work)
    return res.json({
      message: "RFQ published and suppliers notified",
      rfq,
    });
  } catch (err) {
    console.error("Publish RFQ Error:", err);
    return res.status(500).json({ message: err.message });
  }
};


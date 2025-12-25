const PO = require("../models/PO");
const User = require("../models/User");
const { generatePOPDF } = require("../utils/generatePOPDF");
const { sendEmail } = require("../utils/sendEmail");
const { logActivity } = require("../utils/logActivity");
const { createNotification } = require("../utils/createNotification");
const Inventory = require("../models/Inventory");
const Supplier = require("../models/Supplier");

// ============================
// CREATE PO (Status = Pending)
// ============================

exports.createPO = async (req, res) => {
  try {
    const { supplierId, items, notes, rfqId } = req.body;

    const poNumber =
      "PO-" + ((await PO.countDocuments()) + 1).toString().padStart(4, "0");

    let po = await PO.create({
      poNumber,
      supplierId, // Supplier _id
      rfqId,
      items,
      notes,
      status: "pending",
    });

    // ✅ Populate correctly
    po = await PO.findById(po._id)
      .populate("supplierId") // Supplier
      .populate("items.productId", "name");

    if (!po.supplierId) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // ✅ Generate PDF
    const pdfPath = await generatePOPDF(po);

    // ✅ Email supplier
    await sendEmail(
      po.supplierId.email,
      `PO Pending Approval: ${po.poNumber}`,
      `
        <h2>Purchase Order Created</h2>
        <p><b>PO Number:</b> ${po.poNumber}</p>
        <p><b>Supplier:</b> ${po.supplierId.name}</p>
      `,
      [{ filename: `PO_${po.poNumber}.pdf`, path: pdfPath }]
    );

    // Notify managers
    const managers = await User.find({ role: "manager" });
    for (const m of managers) {
      createNotification(m._id, `PO ${po.poNumber} pending approval`);
    }

    res.json({ message: "PO created", po });
  } catch (err) {
    console.error("Create PO Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ============================
// GET PO LIST
// ============================
exports.getPOs = async (req, res) => {
  try {
    const pos = await PO.find().populate("supplierId", "name email");
    res.json(pos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// GET PO DETAILS
// ============================
exports.getPODetails = async (req, res) => {
  try {
    const po = await PO.findById(req.params.id)
      .populate("supplierId")
      .populate("items.productId");

    if (!po) return res.status(404).json({ message: "PO not found" });

    res.json(po);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// APPROVE PO
// ============================
exports.approvePO = async (req, res) => {
  try {
    const po = await PO.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        approvedBy: req.user.id,
      },
      { new: true }
    )
      .populate("supplierId")
      .populate("items.productId");
    for (let item of po.items) {
      const inv = await Inventory.findOne({ productId: item.productId });

      if (inv) {
        inv.quantity += item.quantity;
        await inv.save();
      } else {
        await Inventory.create({
          productId: item.productId,
          quantity: item.quantity,
          minStock: 10,
        });
      }
    }

    if (!po) return res.status(404).json({ message: "PO not found" });
    logActivity(req.user.id, "PO_APPROVED", `PO: ${po.poNumber}`);

    // Generate PDF after approval
    const pdfPath = await generatePOPDF(po);

    // Email supplier after approval
    sendEmail(
      po.supplierId.email,
      `PO Approved: ${po.poNumber}`,
      `
        <h2>Your Purchase Order is Approved</h2>
        <p>PO Number: <b>${po.poNumber}</b></p>
        <p>Please find the attached PO PDF.</p>
      `,
      [
        {
          filename: `PO_${po.poNumber}.pdf`,
          path: pdfPath,
        },
      ]
    );

    return res.json({ message: "PO Approved and emailed to supplier", po });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// REJECT PO
// ============================
exports.rejectPO = async (req, res) => {
  try {
    const po = await PO.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        approvedBy: req.user.id,
      },
      { new: true }
    );

    logActivity(req.user.id, "PO_REJECTED", `PO: ${po.poNumber}`);
    if (!po) return res.status(404).json({ message: "PO not found" });

    return res.json({ message: "PO Rejected", po });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

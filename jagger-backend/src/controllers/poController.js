const PO = require("../models/PO");
const User = require("../models/User");
const { generatePOPDF } = require("../utils/generatePOPDF");
const { sendEmail } = require("../utils/sendEmail");
const { logActivity } = require("../utils/logActivity");
const { createNotification } = require("../utils/createNotification");
const Inventory = require("../models/Inventory");

// ============================
// CREATE PO (Status = Pending)
// ============================
// exports.createPO = async (req, res) => {
//   try {
//     const { supplierId, items, notes, rfqId } = req.body;

//     const count = await PO.countDocuments();
//     const poNumber = "PO-" + (count + 1).toString().padStart(4, "0");

//     const po = await PO.create({
//       poNumber,
//       supplierId,
//       rfqId,
//       items,
//       notes,
//       status: "pending",
//     });

//     // ✅ Fetch supplier user properly
//     const supplier = await User.findById(supplierId);
//     if (!supplier) {
//       return res.status(404).json({ message: "Supplier not found" });
//     }

//     // ✅ Generate PDF
//     const pdfPath = await generatePOPDF(po);

//     // ✅ Email supplier
//     await sendEmail(
//       supplier.email,
//       `PO Pending Approval: ${po.poNumber}`,
//       `
//         <h2>Purchase Order Created</h2>
//         <p>PO Number: <b>${po.poNumber}</b></p>
//         <p>Status: Pending Approval</p>
//       `,
//       [
//         {
//           filename: `PO_${po.poNumber}.pdf`,
//           path: pdfPath,
//         },
//       ]
//     );

//     // ✅ Notify ALL managers
//     const managers = await User.find({ role: "manager" });
//     for (let manager of managers) {
//       createNotification(
//         manager._id,
//         `PO ${po.poNumber} is pending approval`
//       );
//     }

//     return res.json({
//       message: "PO created (Pending Approval)",
//       po,
//     });

//   } catch (err) {
//     console.error("Create PO Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
exports.createPO = async (req, res) => {
  try {
    const { supplierId, items, notes, rfqId } = req.body;

    const count = await PO.countDocuments();
    const poNumber = "PO-" + (count + 1).toString().padStart(4, "0");

    const po = await PO.create({
      poNumber,
      supplierId,
      rfqId,
      items,
      notes,
      status: "pending",
    });

    const supplier = await User.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // ⚠ SAFE PDF GENERATION
    let pdfPath = null;
    try {
      pdfPath = await generatePOPDF(po);
    } catch (pdfErr) {
      console.warn("PDF generation skipped:", pdfErr.message);
    }

    await sendEmail(
      supplier.email,
      `PO Pending Approval: ${po.poNumber}`,
      `<p>PO ${po.poNumber} created. Status: Pending.</p>`,
      pdfPath
        ? [{ filename: `PO_${po.poNumber}.pdf`, path: pdfPath }]
        : []
    );

    const managers = await User.find({ role: "manager" });
    for (const manager of managers) {
      await createNotification(
        manager._id,
        `PO ${po.poNumber} pending approval`
      );
    }

    return res.json({ message: "PO created", po });

  } catch (err) {
    console.error("Create PO Error:", err);
    return res.status(500).json({ message: "PO creation failed" });
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

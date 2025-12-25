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

// exports.createPO = async (req, res) => {
//   try {
//     const { supplierId, items, notes, rfqId } = req.body;

//     const poNumber =
//       "PO-" + ((await PO.countDocuments()) + 1).toString().padStart(4, "0");

//     let po = await PO.create({
//       poNumber,
//       supplierId, // Supplier _id
//       rfqId,
//       items,
//       notes,
//       status: "pending",
//     });

//     // ✅ Populate correctly
//     po = await PO.findById(po._id)
//       .populate("supplierId") // Supplier
//       .populate("items.productId", "name");

//     if (!po.supplierId) {
//       return res.status(404).json({ message: "Supplier not found" });
//     }

//     // ✅ Generate PDF
//     const pdfPath = await generatePOPDF(po);

//     // ✅ Email supplier
//     await sendEmail(
//       po.supplierId.email,
//       `PO Pending Approval: ${po.poNumber}`,
//       `
//         <h2>Purchase Order Created</h2>
//         <p><b>PO Number:</b> ${po.poNumber}</p>
//         <p><b>Supplier:</b> ${po.supplierId.name}</p>
//       `,
//       [{ filename: `PO_${po.poNumber}.pdf`, path: pdfPath }]
//     );

//     // Notify managers
//     const managers = await User.find({ role: "manager" });
//     for (const m of managers) {
//       createNotification(m._id, `PO ${po.poNumber} pending approval`);
//     }

//     res.json({ message: "PO created", po });
//   } catch (err) {
//     console.error("Create PO Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
const mongoose = require("mongoose");

exports.createPO = async (req, res) => {
  try {
    console.log("CREATE PO BODY:", req.body);

    const { supplierId, items, notes = "", rfqId } = req.body;

    // 1️⃣ Basic validation
    if (!supplierId) {
      return res.status(400).json({ message: "supplierId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res.status(400).json({ message: "Invalid supplierId" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "PO items are required" });
    }

    // 2️⃣ Validate supplier exists
    const supplier = await Supplier.findById(supplierId).lean();
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // 3️⃣ Validate items
    for (const item of items) {
      if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: "Invalid productId in items" });
      }

      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity in items" });
      }
    }

    // 4️⃣ Generate PO number (safe)
    const count = await PO.countDocuments();
    const poNumber = `PO-${String(count + 1).padStart(4, "0")}`;

    // 5️⃣ Create PO
    let po = await PO.create({
      poNumber,
      supplierId,
      rfqId: rfqId || null,
      items,
      notes,
      status: "pending",
    });

    // 6️⃣ Populate safely
    po = await PO.findById(po._id)
      .populate("supplierId", "name email")
      .populate("items.productId", "name");

    if (!po) {
      return res.status(500).json({ message: "Failed to load PO after creation" });
    }

    // 7️⃣ Generate PDF (SAFE)
    let pdfPath = null;
    try {
      pdfPath = await generatePOPDF(po);
    } catch (pdfErr) {
      console.error("PDF ERROR:", pdfErr);
      return res.status(500).json({ message: "PO created but PDF failed" });
    }

    // 8️⃣ Email supplier (NON-BLOCKING)
    if (po.supplierId?.email) {
      try {
        await sendEmail(
          po.supplierId.email,
          `PO Pending Approval: ${po.poNumber}`,
          `
            <h2>Purchase Order Created</h2>
            <p><b>PO Number:</b> ${po.poNumber}</p>
            <p><b>Supplier:</b> ${po.supplierId.name}</p>
          `,
          pdfPath
            ? [{ filename: `PO_${po.poNumber}.pdf`, path: pdfPath }]
            : []
        );
      } catch (emailErr) {
        console.error("EMAIL ERROR:", emailErr);
        // Do NOT fail PO creation
      }
    }

    // 9️⃣ Notify managers (NON-BLOCKING)
    const managers = await User.find({ role: "manager" }).select("_id");
    for (const m of managers) {
      try {
        await createNotification(
          m._id,
          `PO ${po.poNumber} pending approval`
        );
      } catch (nErr) {
        console.error("NOTIFICATION ERROR:", nErr);
      }
    }

    // 🔟 SUCCESS
    return res.status(201).json({
      success: true,
      message: "PO created successfully",
      po,
    });

  } catch (err) {
    console.error("CREATE PO FATAL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
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

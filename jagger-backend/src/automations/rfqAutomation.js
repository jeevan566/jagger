const RFQ = require("../models/RFQ");
const Supplier = require("../models/Supplier");
const Quote = require("../models/Quote");
const { sendEmail } = require("../utils/sendEmail");

// ===============================
// 1️⃣ AUTO CLOSE RFQs (7 days old)
// ===============================
exports.autoCloseRFQs = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const rfqs = await RFQ.find({
      status: "published",
      createdAt: { $lte: sevenDaysAgo }
    });

    for (let rfq of rfqs) {
      rfq.status = "closed";
      await rfq.save();
      console.log(`RFQ ${rfq.rfqNumber} auto-closed`);
    }
  } catch (err) {
    console.error("AutoCloseRFQs Error:", err.message);
  }
};

// =====================================
// 2️⃣ RFQ REMINDER TO PENDING SUPPLIERS
// =====================================
exports.rfqReminder = async () => {
  try {
    const rfqs = await RFQ.find({ status: "published" })
      .populate("suppliers");

    for (let rfq of rfqs) {
      for (let supplier of rfq.suppliers) {

        // Check if supplier already submitted quote
        const quote = await Quote.findOne({
          rfqId: rfq._id,
          supplierId: supplier._id
        });

        if (!quote) {
          sendEmail(
            supplier.email,
            `RFQ Reminder: ${rfq.rfqNumber}`,
            `
              <h3>RFQ Reminder</h3>
              <p>Please submit your quotation for RFQ <b>${rfq.rfqNumber}</b>.</p>
            `
          );
        }
      }
    }
  } catch (err) {
    console.error("RFQ Reminder Error:", err.message);
  }
};

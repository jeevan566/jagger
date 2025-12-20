const RFQ = require("../models/RFQ");
const Quote = require("../models/Quote");
const PO = require("../models/PO");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

exports.sendDailySummaryEmail = async () => {
  try {
    console.log("📊 Sending daily summary email...");

    const totalRFQs = await RFQ.countDocuments();
    const pendingQuotes = await Quote.countDocuments({ status: "submitted" });
    const pendingPOs = await PO.countDocuments({ status: "pending" });

    const managers = await User.find({ role: "manager" });

    for (const manager of managers) {
      await sendEmail(
        manager.email,
        "Daily Procurement Summary",
        `
          <h2>Daily Procurement Summary</h2>
          <p><b>Total RFQs:</b> ${totalRFQs}</p>
          <p><b>Pending Quotes:</b> ${pendingQuotes}</p>
          <p><b>Pending POs:</b> ${pendingPOs}</p>
        `
      );
    }

    console.log("✅ Daily summary email sent");
  } catch (err) {
    console.error("Daily Summary Email Error:", err.message);
  }
};

exports.sendPendingPOReminder = async () => {
  try {
    console.log("⏳ Checking pending POs...");

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const pendingPOs = await PO.find({
      status: "pending",
      createdAt: { $lte: twoDaysAgo },
    });

    if (pendingPOs.length === 0) {
      console.log("✅ No pending PO reminders needed");
      return;
    }

    const managers = await User.find({ role: "manager" });

    for (const po of pendingPOs) {
      for (const manager of managers) {
        await sendEmail(
          manager.email,
          "Pending PO Approval Reminder",
          `
            <h3>Pending PO Reminder</h3>
            <p>PO Number: <b>${po.poNumber}</b></p>
            <p>Status: Pending Approval</p>
          `
        );
      }

      console.log(`⚠ Reminder sent for PO ${po.poNumber}`);
    }
  } catch (err) {
    console.error("PO Reminder Error:", err.message);
  }
};

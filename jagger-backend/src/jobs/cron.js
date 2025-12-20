const cron = require("node-cron");
// RFQ Automationx
const { autoCloseRFQs, rfqReminder } = require("../automations/rfqAutomation");

//Inventory automation
const {
  checkLowInventory,
  autoGenerateRFQ,
} = require("../automations/inventoryAutomation");

// Email automation
const {
  sendDailySummaryEmail,
  sendPendingPOReminder,
} = require("../automations/emailAutomation");

// Runs every day at 12:00 AM
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running RFQ automations...");
  await autoCloseRFQs();
  await rfqReminder();
  await checkLowInventory();
  await autoGenerateRFQ();
  await sendDailySummaryEmail();
  await sendPendingPOReminder();
});

// cron.schedule("*/15 * * * * *", async () => {
//   console.log("⏰ [TEST] Cron triggered at", new Date().toLocaleTimeString());

//   await autoCloseRFQs();
//   await rfqReminder();
//   await checkLowInventory();
//   await autoGenerateRFQ();
//   await sendDailySummaryEmail();
//   await sendPendingPOReminder();

//   console.log("✅ [TEST] RFQ automation cycle finished");
// });

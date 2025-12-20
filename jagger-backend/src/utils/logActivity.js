const AuditLog = require("../models/AuditLog");

exports.logActivity = async (userId, action, details = "") => {
  try {
    await AuditLog.create({
      userId,
      action,
      details,
    });
  } catch (err) {
    console.log("Audit Log Error:", err.message);
  }
};

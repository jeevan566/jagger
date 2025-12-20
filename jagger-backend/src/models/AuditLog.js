const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    details: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", AuditLogSchema);

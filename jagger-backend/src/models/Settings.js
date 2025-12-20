const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  companyName: { type: String, default: "" },
  companyAddress: { type: String, default: "" },
  companyEmail: { type: String, default: "" },
  terms: { type: String, default: "" },
  logo: { type: String, default: "" }, // file path
});

module.exports = mongoose.model("Settings", SettingsSchema);

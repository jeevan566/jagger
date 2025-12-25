
const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  contactPerson: String,
  phone: String,
  address: String,
});

module.exports = mongoose.model("Supplier", supplierSchema);

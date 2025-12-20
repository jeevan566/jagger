const mongoose = require("mongoose");

const poSchema = new mongoose.Schema({
  poNumber: { type: String, required: true },
  rfqId: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ" },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      unit: String,
      price: Number,
      total: Number,
    },
  ],
  notes: String,
  status: {
    type: String,
    enum: ["draft", "pending", "approved", "rejected"],
    default: "draft",
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PO", poSchema);

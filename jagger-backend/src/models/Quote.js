const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  rfqId: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ" },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      rfqItemId: { type: mongoose.Schema.Types.ObjectId, ref: "RFQItem" },
      price: Number,
    },
  ],
  notes: String,
  attachment: String, // pdf file path
  status: {
    type: String,
    enum: ["pending", "submitted"],
    default: "pending",
  },
  submittedAt: Date,
});

module.exports = mongoose.model("Quote", quoteSchema);

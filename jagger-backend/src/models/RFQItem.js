const mongoose = require("mongoose");

const rfqItemSchema = new mongoose.Schema({
  rfqId: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
  unit: { type: String },
});

module.exports = mongoose.model("RFQItem", rfqItemSchema);

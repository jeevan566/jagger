const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      unique: true,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    minStock: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", InventorySchema);

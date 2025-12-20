const mongoose = require("mongoose");

const rfqSchema = new mongoose.Schema(
  {
    rfqNumber: { type: String, required: true },
    title: { type: String, required: true },
    notes: { type: String },

    // ✅ Use Supplier master, not User
    suppliers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },
  },
  {
    timestamps: true, // ✅ REQUIRED for automation
  }
);

module.exports = mongoose.model("RFQ", rfqSchema);

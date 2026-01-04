const Inventory = require("../models/Inventory");

// ✅ Get inventory list (ULTRA SAFE)
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate("productId", "name")
      .lean(); // 🔒 convert to plain JS objects

    // 🔥 Safely remove broken records
    const safeInventory = inventory.filter(i => i.productId);

    res.json(safeInventory);
  } catch (err) {
    console.error("Inventory Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Admin: Add inventory manually
exports.addInventory = async (req, res) => {
  try {
    const { productId, quantity, minStock } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product is required" });
    }

    const existing = await Inventory.findOne({ productId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Inventory already exists for this product" });
    }

    const inventory = await Inventory.create({
      productId,
      quantity,
      minStock,
    });

    res.json({ message: "Inventory added", inventory });
  } catch (err) {
    console.error("Add Inventory Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Admin: Update inventory
exports.updateInventory = async (req, res) => {
  try {
    const { quantity, minStock } = req.body;

    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity, minStock },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    res.json(inventory);
  } catch (err) {
    console.error("Update Inventory Error:", err);
    res.status(500).json({ message: err.message });
  }
};


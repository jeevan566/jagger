const Inventory = require("../models/Inventory");

// Get inventory
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("productId");
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add inventory
exports.addInventory = async (req, res) => {
  try {
    const { productId, quantity, minStock } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product is required" });
    }

    const existing = await Inventory.findOne({ productId });
    if (existing) {
      return res.status(400).json({
        message: "Inventory already exists for this product",
      });
    }

    const inventory = await Inventory.create({
      productId,
      quantity: Number(quantity),
      minStock: Number(minStock),
    });

    res.json({ message: "Inventory added", inventory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Admin: Update inventory
exports.updateInventory = async (req, res) => {
  const { quantity, minStock } = req.body;

  const inventory = await Inventory.findByIdAndUpdate(
    req.params.id,
    { quantity, minStock },
    { new: true }
  );

  res.json(inventory);
};

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

// exports.addInventory = async (req, res) => {
//   const { productId, quantity, minStock } = req.body;

//   const existing = await Inventory.findOne({ productId });
//   if (existing) {
//     return res.status(400).json({ message: "Inventory already exists for this product" });
//   }

//   const inventory = await Inventory.create({
//     productId,
//     quantity,
//     minStock,
//   });

//   res.json({ message: "Inventory added", inventory });
// };
exports.addInventory = async (req, res) => {
  try {
    let { productId, quantity, minStock } = req.body;

    // ✅ Convert to numbers
    quantity = Number(quantity);
    minStock = Number(minStock);

    if (!productId || isNaN(quantity) || isNaN(minStock)) {
      return res.status(400).json({ message: "Invalid inventory data" });
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
  const { quantity, minStock } = req.body;

  const inventory = await Inventory.findByIdAndUpdate(
    req.params.id,
    { quantity, minStock },
    { new: true }
  );

  res.json(inventory);
};

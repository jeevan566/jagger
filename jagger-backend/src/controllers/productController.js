const Product = require("../models/Product");
const Inventory = require("../models/Inventory"); // ✅ ADDED

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: "Product created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId", "name");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId");
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE PRODUCT + CASCADE DELETE INVENTORY
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Check product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2️⃣ Delete related inventory (🔥 FIX)
    await Inventory.deleteMany({ productId: id });

    // 3️⃣ Delete product
    await Product.findByIdAndDelete(id);

    res.json({
      message: "Product and related inventory deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

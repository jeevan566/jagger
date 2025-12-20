const Supplier = require("../models/Supplier");

// CREATE SUPPLIER
exports.createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.json({ message: "Supplier added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL SUPPLIERS
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE SUPPLIER
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE SUPPLIER
exports.updateSupplier = async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE SUPPLIER
exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// APPROVE / REJECT
exports.changeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadSupplierDocs = async (req, res) => {
  try {
    const files = req.files.map((file) => ({
      fileName: file.originalname,
      filePath: file.path,
    }));

    const supplier = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { documents: { $each: files } } },
      { new: true }
    );

    res.json({
      message: "Documents uploaded successfully",
      supplier,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

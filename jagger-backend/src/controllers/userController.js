const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET ALL USERS (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSupplierUsers = async (req, res) => {
  try {
    const suppliers = await User.find({ role: "supplier" }).select("-password");
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

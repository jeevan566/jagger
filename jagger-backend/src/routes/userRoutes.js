const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSupplierUsers,
} = require("../controllers/userController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// All routes admin only
router.get("/", auth, role("admin"), getUsers);
router.get("/:id", auth, role("admin"), getUserById);
router.put("/:id", auth, role("admin"), updateUser);
router.delete("/:id", auth, role("admin"), deleteUser);
router.get("/role/supplier", auth, role("admin", "manager"), getSupplierUsers);

module.exports = router;

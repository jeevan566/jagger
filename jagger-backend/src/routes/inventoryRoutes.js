const express = require("express");
const router = express.Router();
const {
  getInventory,
  addInventory,
  updateInventory,
} = require("../controllers/inventoryController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// View inventory
router.get("/", auth, role("admin", "manager"), getInventory);

// Admin add inventory
router.post("/", auth, role("admin"), addInventory);

// Admin update inventory
router.put("/:id", auth, role("admin"), updateInventory);

module.exports = router;

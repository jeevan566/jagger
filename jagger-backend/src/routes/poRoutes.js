const express = require("express");
const router = express.Router();

const {
  createPO,
  getPOs,
  getPODetails,
  approvePO,
  rejectPO,
} = require("../controllers/poController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// Create PO (admin only)
router.post("/", auth, role("admin"), createPO);

// List POs
router.get("/", auth, role("admin", "manager"), getPOs);

// Get PO Details
router.get("/:id", auth, role("admin", "manager"), getPODetails);

// APPROVE PO (Manager Only)
router.put("/:id/approve", auth, role("admin","manager"), approvePO);

// REJECT PO (Manager Only)
router.put("/:id/reject", auth, role("admin","manager"), rejectPO);

module.exports = router;

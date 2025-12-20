const express = require("express");
const router = express.Router();

const {
  createRFQ,
  addItem,
  getRFQs,
  getRFQDetails,
  publishRFQ,
} = require("../controllers/rfqController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// Manager + Admin can create RFQ
router.post("/", auth, role("admin", "manager"), createRFQ);

// Add items
router.post("/:id/add-item", auth, role("admin", "manager"), addItem);

// List RFQs
router.get("/", auth, role("admin", "manager"), getRFQs);

// RFQ details
router.get("/:id", auth, role("admin", "manager"), getRFQDetails);

// Publish RFQ
router.put("/:id/publish", auth, role("admin", "manager"), publishRFQ);

module.exports = router;

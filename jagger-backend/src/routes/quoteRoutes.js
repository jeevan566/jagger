const express = require("express");
const router = express.Router();

const {
  getSupplierRFQs,
  getRFQItems,
  submitQuote,
  getQuotesForRFQ,
  checkQuoteSubmitted,
} = require("../controllers/quoteController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// Supplier dashboard
router.get("/my-rfqs", auth, role("supplier"), getSupplierRFQs);

// Items of each RFQ
router.get("/:id/items", auth, role("supplier"), getRFQItems);
router.get("/:id/check", auth, role("supplier"), checkQuoteSubmitted);


// Submit quote
router.post("/:id/submit", auth, role("supplier"), submitQuote);

router.get("/rfq/:id/compare", auth, role("admin", "manager"), getQuotesForRFQ);

module.exports = router;

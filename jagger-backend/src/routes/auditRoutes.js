const express = require("express");
const router = express.Router();
const { getAuditLogs } = require("../controllers/auditController");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/", auth, role("admin", "manager"), getAuditLogs);

module.exports = router;

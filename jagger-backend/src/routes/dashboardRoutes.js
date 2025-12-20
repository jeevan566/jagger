const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/", auth, role("admin", "manager"), getDashboardStats);

module.exports = router;

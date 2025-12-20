const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { getSettings, updateSettings } = require("../controllers/settingsController");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/", auth, role("admin"), getSettings);

router.put(
  "/",
  auth,
  role("admin"),
  upload.single("logo"),  // optional logo upload
  updateSettings
);

module.exports = router;

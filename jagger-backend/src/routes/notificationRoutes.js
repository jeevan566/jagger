const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const auth = require("../middlewares/auth");

// Get notifications for logged user
router.get("/", auth, async (req, res) => {
  const notes = await Notification.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(notes);
});

// Mark all as read
router.put("/read", auth, async (req, res) => {
  await Notification.updateMany(
    { userId: req.user.id, isRead: false },
    { isRead: true }
  );

  res.json({ message: "All notifications marked as read" });
});

module.exports = router;

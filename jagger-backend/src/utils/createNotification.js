const Notification = require("../models/Notification");

exports.createNotification = async (userId, message) => {
  try {
    await Notification.create({ userId, message });
  } catch (err) {
    console.log("Notification Error:", err.message);
  }
};

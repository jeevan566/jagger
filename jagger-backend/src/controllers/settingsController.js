const Settings = require("../models/Settings");

exports.getSettings = async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
};

exports.updateSettings = async (req, res) => {
  const data = req.body;

  // if logo uploaded
  if (req.file) {
    data.logo = req.file.path;
  }

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(data);
  } else {
    await settings.updateOne(data);
  }

  res.json({ message: "Settings updated successfully", settings });
};

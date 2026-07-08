const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const { freeShippingThreshold, shippingCharge, codCharge, isPrepaidEnabled } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({
        freeShippingThreshold,
        shippingCharge,
        codCharge,
        isPrepaidEnabled,
      });
    } else {
      settings.freeShippingThreshold = freeShippingThreshold;
      settings.shippingCharge = shippingCharge;
      settings.codCharge = codCharge;
      settings.isPrepaidEnabled = isPrepaidEnabled;
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};

const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema(
  {
    freeShippingThreshold: {
      type: Number,
      required: true,
      default: 500,
    },
    shippingCharge: {
      type: Number,
      required: true,
      default: 100,
    },
    codCharge: {
      type: Number,
      required: true,
      default: 50,
    },
    isPrepaidEnabled: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;

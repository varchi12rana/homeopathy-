const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  showOnSlider: {
    type: Boolean,
    default: false,
  },
  country: {
    type: String,
    default: 'India',
  },
  tagline: {
    type: String,
    default: 'Excellence in Homeopathy',
  },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);

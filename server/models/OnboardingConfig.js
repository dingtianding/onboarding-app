const mongoose = require('mongoose');

const onboardingConfigSchema = new mongoose.Schema({
  aboutMePage: {
    type: Number,
    enum: [2, 3],
    default: 2
  },
  addressPage: {
    type: Number,
    enum: [2, 3],
    default: 2
  },
  birthdatePage: {
    type: Number,
    enum: [2, 3],
    default: 3
  }
}, {
  timestamps: true
});

const OnboardingConfig = mongoose.model('OnboardingConfig', onboardingConfigSchema);

module.exports = OnboardingConfig; 
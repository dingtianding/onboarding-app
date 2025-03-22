const express = require('express');
const OnboardingConfig = require('../models/OnboardingConfig');
const router = express.Router();

// Get onboarding configuration
router.get('/', async (req, res) => {
  try {
    let config = await OnboardingConfig.findOne();
    
    // Create default config if none exists
    if (!config) {
      config = await OnboardingConfig.create({
        aboutMePage: 2,
        addressPage: 2,
        birthdatePage: 3
      });
    }
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update onboarding configuration
router.put('/', async (req, res) => {
  try {
    const { aboutMePage, addressPage, birthdatePage } = req.body;
    
    // Validate that at least one component is on each page
    const page2Components = [
      aboutMePage === 2, 
      addressPage === 2, 
      birthdatePage === 2
    ].filter(Boolean).length;
    
    const page3Components = [
      aboutMePage === 3, 
      addressPage === 3, 
      birthdatePage === 3
    ].filter(Boolean).length;
    
    if (page2Components === 0 || page3Components === 0) {
      return res.status(400).json({ 
        message: 'Each page must have at least one component' 
      });
    }
    
    // Find existing config or create new one
    let config = await OnboardingConfig.findOne();
    
    if (config) {
      config.aboutMePage = aboutMePage;
      config.addressPage = addressPage;
      config.birthdatePage = birthdatePage;
      await config.save();
    } else {
      config = await OnboardingConfig.create({
        aboutMePage,
        addressPage,
        birthdatePage
      });
    }
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
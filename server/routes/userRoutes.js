const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all users (for data table)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new user (step 1)
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({
      email,
      password,
      onboardingStep: 2
    });
    
    await user.save();
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user data (steps 2 and 3)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find and update user
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
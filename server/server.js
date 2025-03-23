const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const configRoutes = require('./routes/configRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

// Add this before your other routes
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'API is working!' });
});

// Add this route handler for the root path
app.get('/', (req, res) => {
  res.json({ 
    message: 'Onboarding API is running',
    endpoints: [
      '/api/users',
      '/api/config',
      '/api/test'
    ]
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/config', configRoutes);

// Add a ping endpoint
app.get('/api/ping', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Backend service is awake and ready to handle requests'
  });
});

// Clear all users from the database
app.post('/api/users/clear-all', async (req, res) => {
  console.log('Clear database endpoint called');
  try {
    // Log MongoDB connection status
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    
    // Make sure you're using the correct model name
    console.log('Available models:', Object.keys(mongoose.models));
    
    // Get the User model
    let User;
    try {
      User = mongoose.model('User');
      console.log('User model retrieved successfully');
    } catch (modelError) {
      console.error('Error getting User model:', modelError);
      return res.status(500).json({ 
        message: 'Failed to get User model', 
        error: modelError.message,
        availableModels: Object.keys(mongoose.models)
      });
    }
    
    console.log('Attempting to clear users collection');
    
    // Execute the delete operation with a timeout
    const result = await Promise.race([
      User.deleteMany({}),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timed out')), 30000)
      )
    ]);
    
    console.log('Database cleared successfully', { 
      deletedCount: result.deletedCount,
      acknowledged: result.acknowledged
    });
    
    res.json({ 
      message: 'Database cleared successfully', 
      deletedCount: result.deletedCount,
      acknowledged: result.acknowledged
    });
  } catch (error) {
    console.error('Error clearing database:', error);
    console.error('Error stack:', error.stack);
    
    // Send detailed error information
    res.status(500).json({ 
      message: 'Failed to clear database', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

// Add this endpoint to your server.js file
app.get('/api/routes', (req, res) => {
  // Get all registered routes
  const routes = [];
  
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  
  res.json({
    message: 'Available routes',
    routes: routes
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Add an error handling middleware at the end
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Error stack:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Login endpoint
app.post('/api/users/login', async (req, res) => {
  console.log('Login attempt received at /api/users/login:', req.body);
  
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const User = mongoose.model('User');
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Login failed: User not found -', email);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if the password is already hashed
    const isPasswordHashed = user.password.startsWith('$2');
    
    let passwordMatches;
    if (isPasswordHashed) {
      // Compare with bcryptjs if the password is hashed
      try {
        passwordMatches = await bcrypt.compare(password, user.password);
      } catch (err) {
        console.error('bcryptjs compare error:', err);
        passwordMatches = false;
      }
    } else {
      // Direct comparison for non-hashed passwords (for testing/development)
      passwordMatches = user.password === password;
    }
    
    if (!passwordMatches) {
      console.log('Login failed: Incorrect password for', email);
      return res.status(401).json({ message: 'Incorrect password' });
    }
    
    console.log('Login successful for:', email);
    console.log('User onboarding step:', user.onboardingStep);
    
    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        onboardingStep: user.onboardingStep || 1, // Default to step 1 if not set
        onboardingComplete: user.onboardingComplete || false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// User registration endpoint with bcryptjs password hashing
app.post('/users', async (req, res) => {
  console.log('User registration attempt:', req.body);
  
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      console.log('User registration failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Check if user already exists
    const User = mongoose.model('User');
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log('User registration failed: User already exists -', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user with hashed password
    const newUser = new User({
      email,
      password: hashedPassword,
      onboardingStep: 1,
      onboardingComplete: false
    });
    
    await newUser.save();
    
    console.log('User registered successfully:', email);
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      onboardingStep: newUser.onboardingStep,
      onboardingComplete: newUser.onboardingComplete
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'Server error during user registration' });
  }
}); 
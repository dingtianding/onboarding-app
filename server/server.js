const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const configRoutes = require('./routes/configRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/config', configRoutes);

// Add this route to test MongoDB connection
app.get('/api/test-db', async (req, res) => {
  try {
    // Simple query to test the database connection
    const count = await mongoose.connection.db.collection('users').countDocuments();
    res.json({ message: 'Database connection successful', count });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Update your server.js file to use the PORT from environment variables
const PORT = process.env.PORT || 5001;

// Listen on the correct port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
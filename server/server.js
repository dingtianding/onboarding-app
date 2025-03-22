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
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/config', configRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server with port fallback
const PORT = process.env.PORT || 5000;
const ALTERNATIVE_PORTS = [5001, 5002, 5003];

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    
    // Update the client's .env.local file with the correct port
    if (port !== 5000) {
      console.log(`NOTE: Update your client/.env.local file to use port ${port}:`);
      console.log(`NEXT_PUBLIC_API_URL=http://localhost:${port}/api`);
    }
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying another port...`);
      if (ALTERNATIVE_PORTS.length > 0) {
        const nextPort = ALTERNATIVE_PORTS.shift();
        startServer(nextPort);
      } else {
        console.error('All ports are busy. Please free up a port or specify a different port in the .env file.');
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

startServer(PORT); 
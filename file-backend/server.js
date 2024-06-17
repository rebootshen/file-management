


// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const { auth, authorize } = require('./middle/auth');

const cors = require('cors');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middle/errorHandler');
const rateLimiter = require('./middle/rateLimiter');
const createDefaultUser = require('./createDefaultUser');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// Apply rate limiter to all requests
app.use(rateLimiter);

// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// mongoose.connect(process.env.MONGO_URI)
//   .then(async () => {
//     console.log('MongoDB connected');
//     await createDefaultUser(); // Create default user
//   })
//   .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/users', require('./routes/user'));
app.use('/api/files', require('./routes/file'));

// Example of protected route
app.get('/api/protected', auth, authorize('admin', 'editor'), (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
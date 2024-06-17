


// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const { auth, authorize } = require('./middle/auth');


// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());


//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/users', require('./routes/user'));


// Example of protected route
app.get('/api/protected', auth, authorize('admin', 'editor'), (req, res) => {
  res.json({ message: 'This is a protected route' });
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
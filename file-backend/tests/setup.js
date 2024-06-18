// tests/setup.js
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load the .env.test file
dotenv.config({ path: './.env.test' });

// Dynamically assign a unique port for each test suite
const port = 5000 + Math.floor(Math.random() * 1000);
process.env.PORT = port.toString();
console.log(`Using port ${port} for tests`);
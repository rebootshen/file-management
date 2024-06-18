// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.log('No authHeader, authorization denied');
    return res.status(401).json({ message: 'No authHeader, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    console.log('No token, authorization denied');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      console.log('Access denied: User not found');
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (err) {
    console.log('Token is not valid');
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(req.user.role + " is not in role list")
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { auth, authorize };
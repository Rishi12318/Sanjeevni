// middleware/auth.js - Authentication middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const NGO = require('../models/NGO');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user based on role
    let user;
    if (decoded.role === 'user') {
      user = await User.findById(decoded.id);
    } else if (decoded.role === 'doctor') {
      user = await Doctor.findById(decoded.id);
    } else if (decoded.role === 'ngo') {
      user = await NGO.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

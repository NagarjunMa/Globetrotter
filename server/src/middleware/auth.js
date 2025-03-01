const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('../utils/errorHandler');
const User = require('../models/User');

/**
 * Protect routes
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token
    token = req.headers.authorization.split(' ')[1];
  } 

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please login to access this resource'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to request object
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again'
    });
  }
};

/**
 * Optional authentication - adds user to req if token is valid, but doesn't block the request
 */
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    // Don't return error, just continue without user
    next();
  }
};
/**
 * Custom Error Response Class
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for developers
  console.error(err);

  // Default response
  let statusCode = 500;
  let message = 'Server error';

  // Handle specific error types
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate value entered';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Invalid input data';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired, please log in again';
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = {
  ErrorResponse,
  errorHandler
};
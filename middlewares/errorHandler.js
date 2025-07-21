// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  // Set default status code and message
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle specific errors
  // Example: PostgreSQL duplicate key error (code 23505)
  if (err.code === '23505' && err.detail.includes('already exists')) {
    statusCode = 409; // Conflict
    // Extract column name and value from detail
    const match = err.detail.match(/\(Key \((.*?)\)=\((.*?)\) already exists\)/);
    if (match && match[1] && match[2]) {
      message = `A record with ${match[1]} '${match[2]}' already exists.`;
    } else {
      message = 'Duplicate entry error.';
    }
  }

  // Example: JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized, token failed';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, token expired';
  }

  // Handle custom errors thrown with specific status codes (e.g., from services)
  // If you throw new Error("Some message", { cause: 400 }), you can catch it here.
  if (err.statusCode) { // Assuming a custom error might attach a statusCode
      statusCode = err.statusCode;
  }


  // Log error in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack); // Full stack trace in development
  }

  res.status(statusCode).json({
    message: message,
    // Include stack trace only in development mode for debugging
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

module.exports = errorHandler;
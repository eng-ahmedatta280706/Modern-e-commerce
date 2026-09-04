/**
 * Central error handling middleware.
 * Always returns JSON with { success, message, errors? }.
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Internal Server Error';

  // Postgres unique-violation (duplicate key)
  if (err.code === '23505') {
    message = 'A record with these details already exists.';
    statusCode = 409;
  }

  // Postgres not-null violation
  if (err.code === '23502') {
    message = `Missing required field: ${err.column || 'unknown'}.`;
    statusCode = 422;
  }

  // Postgres invalid text representation (e.g. bad UUID)
  if (err.code === '22P02') {
    message = 'Invalid input format.';
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  { message = 'Invalid token.';  statusCode = 401; }
  if (err.name === 'TokenExpiredError')  { message = 'Token expired.';  statusCode = 401; }

  if (process.env.NODE_ENV === 'development') {
    console.error('❌', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Creates a formatted AppError.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { errorHandler, AppError };
export default { errorHandler, AppError };

const logger = require('../../config/logger');

const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message, errors } = err;

  if (!statusCode) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  logger.error(`${req.method} ${req.url} - Error: ${err.message} - Stack: ${err.stack}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && errors.length ? { errors } : {})
  });
};

module.exports = errorMiddleware;

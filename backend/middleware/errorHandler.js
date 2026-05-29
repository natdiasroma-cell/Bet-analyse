const logger = require('../utils/logger');

const errorHandler = (error, req, res, next) => {
  logger.error('Error:', error);

  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    status,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;

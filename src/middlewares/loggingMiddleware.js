const logger = require("../utils/loggingUtils");

const loggingMiddleware = (req, res, next) => {
  // Log request details
  logger.info(`Request: ${req.method} ${req.originalUrl}`);

  // Log response details
  logger.info(`Response: ${res.statusCode}`);

  // Log any encountered errors
  res.on("error", (error) => {
    logger.error(`Error: ${error.message}`);
  });

  next();
};

module.exports = loggingMiddleware;

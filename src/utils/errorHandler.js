const { logger } = require("../middlewares/loggingMiddleware");

module.exports = (err, req, res, next) => {
  logger.error(`Error message: ${err.message}`);
  logger.error(`Error stack: ${err.stack}`);
  res.status(500).send("Internal Server Error");
};

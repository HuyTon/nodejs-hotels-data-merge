const { logger } = require("../middlewares/loggingMiddleware");

module.exports = (err, req, res, next) => {
  // console.error(err.stack);
  console.error("***err", err);
  logger.error(`Error: ${err.stack}`);
  res.status(500).send("Internal Server Error");
};

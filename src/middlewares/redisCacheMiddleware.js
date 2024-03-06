const redisCacheUtils = require("../utils/redisCacheUtils");

const redisCacheMiddleware = (
  options = {
    EX: 3600, // 1h
    NX: false, // Write the data even if the key already exists
  }
) => {
  return async (req, res, next) => {
    if (redisCacheUtils.isRedisWorking()) {
      const key = redisCacheUtils.generateKey(req);
      const cachedValue = await redisCacheUtils.readData(key);
      if (cachedValue) {
        try {
          // If it is JSON data, then return it
          return res.json(JSON.parse(cachedValue));
        } catch {
          // If it is not JSON data, then return it
          return res.send(cachedValue);
        }
      } else {
        // Override res.send
        const oldSend = res.send;
        res.send = (data) => {
          // Set the function back to avoid the 'double-send' effect
          res.send = oldSend;

          // Cache the response only if it is successful
          if (res.statusCode.toString().startsWith("2")) {
            redisCacheUtils.writeData(key, data, options).then();
          }

          return res.send(data);
        };

        // Continue to the controller function
        next();
      }
    } else {
      next();
    }
  };
};

module.exports = redisCacheMiddleware;

const redis = require("redis");
const hash = require("object-hash");
const logger = require("./loggingUtils");

const redisCacheUtils = ((
  defaultOptions = {
    EX: 3600, // 1h
    NX: false, // Write the data even if the key already exists
  }
) => {
  let redisClient = undefined;

  const initializeRedisClient = async () => {
    // Read the Redis connection URL from the envs
    let redisURL = process.env.REDIS_URI;
    if (redisURL) {
      // Create a redis client
      redisClient = redis.createClient({
        url: redisURL,
      });

      // Register events on the redis client
      redisClient.on("error", (error) =>
        logger.error(`Failed to create the Redis client with error: ${error}`)
      );

      redisClient.on("ready", () => logger.info("Redis is ready!"));

      try {
        await redisClient.connect();
        await redisClient.ping();
      } catch (error) {
        logger.error(`Connection to Redis failed with error: ${error}`);
      }
    }
  };

  const isRedisWorking = () => {
    return !!redisClient?.isOpen;
  };

  const writeData = async (key, data, options = null) => {
    if (isRedisWorking()) {
      try {
        let redisOptions = options;
        if (!redisOptions) {
          redisOptions = defaultOptions;
        }
        await redisClient.set(key, data, redisOptions);
      } catch (error) {
        logger.error(`Failed to cache data for key=${key}`, e);
      }
    }
  };

  const readData = async (key) => {
    let cachedValue = undefined;

    if (isRedisWorking()) {
      cachedValue = await redisClient.get(key);
      if (cachedValue) {
        return cachedValue;
      }
    }
  };

  const generateKey = (req) => {
    const reqDataToHash = {
      query: req.query,
      body: req.body,
    };

    return `${req.path}@${hash.sha1(reqDataToHash)}`;
  };

  return {
    initializeRedisClient: initializeRedisClient,
    isRedisWorking: isRedisWorking,
    readData: readData,
    writeData: writeData,
    generateKey: generateKey,
  };
})();

module.exports = redisCacheUtils;

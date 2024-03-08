const apiKeyData = require("../data/apiKeyData");

const validateApiKey = async (req, res, next) => {
  const apiKey = req.header("x-api-key");

  const isValid = await apiKeyData.isValidApiKey(apiKey);
  if (!isValid) {
    return res.status(401).json({ error: "Unauthorized!" });
  }
  next();
};

// The mock function to quick verify api key
const isValidApiKey = (apiKey) => {
  const authorizedKeys = ["auth_api_key_1", "auth_api_key_2"];
  return authorizedKeys.includes(apiKey);
};

module.exports = { validateApiKey };

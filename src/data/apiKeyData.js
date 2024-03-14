const db = require("./db");

const apiKeyData = {
  isValidApiKey: async (apiKey) => {
    if (!apiKey) return false;

    try {
      const sql = "SELECT COUNT(*) AS count FROM api_keys WHERE api_key = ?";
      const results = await db.query(sql, [apiKey]);
      const count = results[0].count;
      return count > 0;
    } catch (error) {
      console.error("Error validating API key:", error);
      throw error;
    }
  },
};

module.exports = apiKeyData;

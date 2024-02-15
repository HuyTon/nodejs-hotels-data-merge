const { fetchAndMergeData } = require("./fetchAndMergeData");

module.exports.getAllHotels = async () => {
  return await fetchAndMergeData();
};

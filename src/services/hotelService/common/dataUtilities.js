const config = require("config");
const Helper = require("../../../utils/helper");

const selectBestHotelName = (hotelOptions) => {
  let bestName = "";
  let bestScore = 0;

  // Define the criteria weights
  const weights = {
    relevance: 0.35,
    memorability: 0.25,
    brandIdentity: 0.4,
  };

  // Evaluate each hotel name option
  for (const option of hotelOptions) {
    let score = 0;
    const name = option.toLowerCase();

    // Criteria 1: Relevance and Descriptiveness
    // The hotelOptions contain properties like location, features, target audience
    if (
      name.includes("beach") ||
      name.includes("resort") ||
      name.includes("villa")
    ) {
      score += 10;
    }

    // Add more relevance checking based on location.
    if (Helper.containsLocationInfo(name)) {
      score += 10;
    }

    // Criteria 2: Memorability
    // Evaluation based on name length
    if (name.length <= 20) {
      score += 5;
    }

    // Criteria 3: Brand Identity
    // Evaluation based on brand identity
    for (const brand in config.brandIdentityFilter) {
      for (const keyword of config.brandIdentityFilter[brand]) {
        if (name.includes(keyword)) {
          score += 15;
        }
      }
    }

    // Calculate total score
    let totalScore = 0;
    Object.keys(weights).forEach((criteria) => {
      totalScore += weights[criteria] * score;
    });

    // Update best name if the current option has a higher score
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestName = name;
    }
  }

  return Helper.capitalizeFirstLetterSentence(bestName);
};

const selectBestAddress = (addresses) => {
  // Criteria for selecting the best address:
  // 1. Contains postal code
  // 2. Longest length if postal codes are not present
  let bestAddress = "";
  const regex = "/\bd{6}\b/";
  for (const address of addresses) {
    if (
      (!bestAddress && address.match(regex)) ||
      (address.match(regex) && !bestAddress.match(regex)) ||
      (address.length > bestAddress.length &&
        !address.match(regex) &&
        !bestAddress.match(regex))
    ) {
      bestAddress = address;
    }
  }

  return bestAddress;
};

const selectBestDescription = (descriptions) => {
  let bestDescription = "";
  let maxScore = 0;

  // Define the criteria weights
  const weights = {
    specific: 0.3,
    location: 0.4,
    languageQuality: 0.3,
  };

  if (descriptions.length === 0) {
    return "";
  }

  descriptions.forEach((description) => {
    let score = 0;
    const lowerCaseDescription = description.toLowerCase();

    // Criteria 1: Check for specific details
    const specificDetailsFilter = config.get("specificDetailsFilter");
    specificDetailsFilter.forEach((item) => {
      if (lowerCaseDescription.includes(item)) {
        score += 5;
      }
    });

    // Criteria 2: Check for location information
    const locationInformationFilter = config.get("locationInformationFilter");
    locationInformationFilter.forEach((item) => {
      if (lowerCaseDescription.includes(item)) {
        score += 10;
      }
    });

    // Criteria 3: Check for quality of language
    if (
      lowerCaseDescription.length > 100 &&
      lowerCaseDescription.split(" ").length > 20
    ) {
      score += 5;
    }

    // Calculate total score
    let totalScore = 0;
    Object.keys(weights).forEach((criteria) => {
      totalScore += weights[criteria] * score;
    });

    if (totalScore > maxScore) {
      maxScore = totalScore;
      bestDescription = description;
    }
  });

  if (!bestDescription) {
    bestDescription = descriptions[0];
  }

  return bestDescription;
};

const selectBestImageCategory = (category) => {
  const bestCategory = {};

  category.forEach((item) => {
    const existingItem = bestCategory[item.link];
    if (
      !existingItem ||
      existingItem.description.length < item.description.length
    ) {
      bestCategory[item.link] = item;
    }
  });

  // Get the keys of the object and sort them
  let sortedKeys = Object.keys(bestCategory).sort();

  // Create a new object with sorted keys and corresponding values
  let sortedCategory = {};
  sortedKeys.forEach((key) => {
    sortedCategory[key] = bestCategory[key];
  });

  return Object.values(sortedCategory);
};

module.exports = {
  selectBestHotelName,
  selectBestAddress,
  selectBestDescription,
  selectBestImageCategory,
};

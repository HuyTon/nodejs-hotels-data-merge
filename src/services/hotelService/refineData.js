const {
  selectBestHotelName,
  selectBestAddress,
  selectBestDescription,
  selectBestImageCategory,
} = require("./common/dataUtilities");

const refineData = (sanitizedData) => {
  let refinedData = [...sanitizedData];

  refinedData.forEach((data) => {
    if (data) {
      // A. Criteria for selecting the best name:
      // 1. Relevance and Descriptiveness (The name contains properties like location, features, target audience)
      // 2. Memorability (Evaluation based on name length)
      // 3. Brand Identity (Luxury, budget, modern, etc)
      data.name = selectBestHotelName(data.name);

      // B. Criteria for selecting the best address:
      // 1. Contains postal code
      // 2. Longest length if postal codes are not present
      data.location.address = selectBestAddress(data.location.address);

      // C. Criteria for selecting the best description:
      // 1. Specific Details:     Descriptions that contain specific amenities, features,
      //                          and services provide a clearer picture of what guests can expect.
      //
      // 2. Location Information: Descriptions that mention the location, nearby attractions,
      //                          and unique selling points of the property can be more appealing.
      //
      // 3. Quality of Language:  Descriptions that are well-written, engaging,
      //                          and descriptive descriptions fulfill the length of sentences.
      //
      data.description = selectBestDescription(data.description);

      // D. Refine amenities:
      // 1. Remove duplicated general and room items
      // 2. Standardize general and room items
      if (data.amenities) {
        if (data.amenities.hasOwnProperty("general")) {
          // Create a Set to store unique general
          let uniqueItemsSet = new Set();
          let result = data.amenities.general.filter((item) => {
            const lowerCaseItem = item.toLowerCase();

            if (!uniqueItemsSet.has(lowerCaseItem)) {
              uniqueItemsSet.add(lowerCaseItem);
              return true;
            } else {
              return false;
            }
          });
          data.amenities.general = result;
        }
        if (data.amenities.hasOwnProperty("room")) {
          // Create a Set to store unique room
          let uniqueItemsSet = new Set();
          let result = data.amenities.room.filter((item) => {
            const lowerCaseItem = item.toLowerCase();

            if (!uniqueItemsSet.has(lowerCaseItem)) {
              uniqueItemsSet.add(lowerCaseItem);
              return true;
            } else {
              return false;
            }
          });
          data.amenities.room = result;
        }
      }

      // E. Refine image rooms from suppliers:
      // 1. Each image rooms should have unique hyperlink information
      // 2. If there are duplicate hyperlinks, select the hyperlink with the longest description
      if (data.images.hasOwnProperty("rooms") && data.images.rooms.length > 0) {
        data.images.rooms = selectBestImageCategory(data.images.rooms);
      }

      // F. Refine image site from suppliers:
      // 1. Each image site should have unique hyperlink information
      // 2. If there are duplicate hyperlinks, select the hyperlink with the longest description
      if (data.images.hasOwnProperty("site") && data.images.site.length > 0) {
        data.images.site = selectBestImageCategory(data.images.site);
      }

      // G. Refine image amenities from suppliers:
      // 1. Each image amenity should have unique hyperlink information
      // 2. If there are duplicate hyperlinks, select the hyperlink with the longest description
      if (
        data.images.hasOwnProperty("amenities") &&
        data.images.amenities.length > 0
      ) {
        data.images.amenities = selectBestImageCategory(data.images.amenities);
      }
    }
  });

  return refinedData;
};

module.exports = { refineData };

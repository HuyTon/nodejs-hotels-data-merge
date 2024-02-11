const Helper = require('../../utils/helper');

const refineData = (sanitizedData) => {  
    let refinedData = [...sanitizedData];
  
    refinedData.forEach(data => {
      if (data) {
        // A. Criteria for selecting the best name:
        // 1. Longest length
        // 2. Contains specific location information (city, region, etc.)
        let bestName =  '';
        for (const name of data.name) {
          if ((!bestName && Helper.containsLocationInfo(name)) ||
              (name.length > bestName.length && !Helper.containsLocationInfo(bestName)) ||
              (name.length > bestName.length && Helper.containsLocationInfo(name) && !Helper.containsLocationInfo(bestName))) {
                bestName = name;
          }
        }
        data.name = bestName;
  
        // B. Criteria for selecting the best address:
        // 1. Contains postal code
        // 2. Longest length if postal codes are not present
        let bestAddress = '';
        const regex = '/\b\d{6}\b/';
        for (const address of data.location.address) {        
          if ((!bestAddress && address.match(regex)) ||
              (address.match(regex) && !bestAddress.match(regex)) ||
              (address.length > bestAddress.length && !address.match(regex) && !bestAddress.match(regex))) {
                bestAddress = address;
          }
        }      
        data.location.address = bestAddress;
  
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
        let bestDescription = '';
        let maxScore = 0;
        data.description.forEach (description => {
          const lowerCaseDescription = description.toLowerCase();
          let score = 0;
          
          // Check for specific details
          const specificDetails = ['amenities', 'features', 'garden', 'sea view', 'sundeck', 'pool', 'hot tub', 'free parking', 'free wifi', 'free wi-fi', 'coffeemaking', 'teamaking'];
          specificDetails.forEach((item) => {
            if (lowerCaseDescription.includes(item)) {
              score++;
            } 
          });
          
          // Check for location information
          const locationInformation = ['location', 'located', 'nearby', 'walk from', 'walk to', 'attractions', 'restaurant', 'bars', 'pubs', 'club'];
          locationInformation.forEach((item) => {
            if (lowerCaseDescription.includes(item)) {
              score++;
            } 
          });
          
          // Check for quality of language
          if (lowerCaseDescription.length > 100 && lowerCaseDescription.split(' ').length > 20) {
            score++;
          }
  
          if (score > maxScore) {
            maxScore = score;
            bestDescription = description;
          }
        });
        data.description = bestDescription;
  
        // D. Refine amenities:
        // 1. Remove duplicated general and room items
        // 2. Standardize general and room items
        if(data.amenities) {
          if(data.amenities.hasOwnProperty('general')) {
            // Create a hash map to store unique general
            let uniqueItemsMap = {};
            let result = data.amenities.general.filter(item => {
              const lowerCaseItem = item.toLowerCase();
              
              if (!uniqueItemsMap.hasOwnProperty(lowerCaseItem)) {
                  uniqueItemsMap[lowerCaseItem] = true;
                  item = lowerCaseItem;
                  return true;
              } else {
                  return false;
              }
            });
            data.amenities.general = result;
          }
          if(data.amenities.hasOwnProperty('room')) {
            // Create a hash map to store unique room
            let uniqueItemsMap = {};
            let result = data.amenities.room.filter(item => {
              const lowerCaseItem = item.toLowerCase();
              
              if (!uniqueItemsMap.hasOwnProperty(lowerCaseItem)) {
                  uniqueItemsMap[lowerCaseItem] = true;
                  item = lowerCaseItem;
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
        if(data.images.hasOwnProperty('rooms')) {
          data.images.rooms = refineImageCategory(data.images.rooms);
        }
  
        // F. Refine image site from suppliers:
        // 1. Each image site should have unique hyperlink information 
        // 2. If there are duplicate hyperlinks, select the hyperlink with the longest description
        if(data.images.hasOwnProperty('site')) {        
          data.images.site = refineImageCategory(data.images.site);
        }
  
        // G. Refine image amenities from suppliers:
        // 1. Each image amenity should have unique hyperlink information 
        // 2. If there are duplicate hyperlinks, select the hyperlink with the longest description
        if(data.images.hasOwnProperty('amenities')) {        
          data.images.amenities = refineImageCategory(data.images.amenities);
        }      
      }
    });
    
    return refinedData;
  }
  
  const refineImageCategory = (category) => {
    const bestCategory = {};
  
    category.forEach(item => {
      const existingItem = bestCategory[item.link];
      if (!existingItem || existingItem.description.length < item.description.length) {
        bestCategory[item.link] = item;
      }
    });
  
    return bestCategory;
  }

  module.exports = { refineData };
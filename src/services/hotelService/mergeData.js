const { log } = require('../../utils/logger');
const Helper = require('../../utils/helper');
const { createIdMap, groupById } = require('./groupData');
const { sanitizeData } = require('./sanitizeData');
const { refineData } = require('./refineData');

const mergeData = async () => {
  try {    
    // Fetch data from all suppliers concurrently
    const [acmeData, patagoniaData, paperfliesData] = await Promise.all([
      Helper.fetchData('https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme'),
      Helper.fetchData('https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia'),
      Helper.fetchData('https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies'),    
    ]);

    // Check if all of the data fetched are empty
    if (!acmeData && !patagoniaData && !paperfliesData) {
        log('Empty data received from all suppliers.');
        return null;
    }

    // Create a mapping of IDs to data objects for each supplier
    const acmeMap = createIdMap(acmeData);
    const patagoniaMap = createIdMap(patagoniaData);
    const paperfliesMap = createIdMap(paperfliesData);

    // Group data from suppliers based on matching IDs
    const groupedData = groupById(acmeMap, patagoniaMap, paperfliesMap);    
    
    // Perform data cleaning and standardize names and formats of properties
    const sanitizedData = await sanitizeData(groupedData);    
  
    // Apply criteria to select the best properties
    const refinedData = refineData(sanitizedData);    

    return refinedData;
    
  } catch (error) {
    this.logger.error('Error occurred during data merge:', error);
    return null;
  }
}

module.exports = { mergeData };
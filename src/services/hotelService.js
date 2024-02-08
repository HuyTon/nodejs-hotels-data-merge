const axios = require('axios');
const { log } = require('../utils/logger');
const Helper = require('../utils/helper');

// Function to fetch data from supplier endpoints
async function fetchData(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      log(`Error fetching data from ${url}: ${error.message}`);
      return null;
    }
}

// Function to merge data from suppliers
const mergeData = async () => {
    // Fetch data from each supplier
    const acmeData = await fetchData('https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme');
    const patagoniaData = await fetchData('https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia');
    const paperfliesData = await fetchData('https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies');    

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
    const cleanedData = await cleanAndMergeData(groupedData);
  
    // Select the best data based on defined criteria
    const bestData = selectBestProperties(cleanedData);

    return bestData;
}

// Function to create a mapping of IDs to data objects
function createIdMap(data) {    
    if(data) {
        const idMap = new Map();
        data.forEach(item => {
            idMap.set(item.id ? item.id : item.Id ? item.Id : item.hotel_id, item);
        });        
        return idMap;
    }
    return null;
}

// Function to merge data from suppliers based on matching IDs
function groupById(acmeMap, patagoniaMap, paperfliesMap) {
    const groupedData = [];
  
    // Iterate over each ID in one of the maps,
    // allIds will contains unique keys.
    const allIds = new Set([...acmeMap.keys(), ...patagoniaMap.keys(), ...paperfliesMap.keys()]);    

    allIds.forEach((id) => {
        const groupedItem = {};

        // Group data from all suppliers based on matching IDs
        if (acmeMap.has(id)) {
          groupedItem.acme = acmeMap.get(id);
        }
        if (patagoniaMap.has(id)) {
          groupedItem.patagonia = patagoniaMap.get(id);
        }
        if (paperfliesMap.has(id)) {
          groupedItem.paperflies = paperfliesMap.get(id);
        }

        groupedData.push(groupedItem);
    });
  
    return groupedData;
}

const cleanAndMergeData = async (groupedData) => {
  const cleanedData = [];

  // Parse and clean each item in the grouped data array
  for (const item of groupedData) {
    const cleanedItem = {};

    // Loop through keys of the item to dynamically determine the supplier
    for (const key of Object.keys(item)) {
      const supplier = item[key];
      console.log('supplier', supplier);
      // Rules: 
      // 1. Standardize Property Names
      // 2. Refrain from selecting "dirty" properties
      // 3. Normalize data formats
      if(!cleanedItem.id) {
        cleanedItem.id = supplier.id || supplier.Id || supplier.hotel_id;
      }
      if(!cleanedItem.destination_id) {
        cleanedItem.destination_id = supplier.destination || supplier.DestinationId || supplier.destination_id;
      }
      if(!cleanedItem.names) {
        cleanedItem.names = [supplier.name || supplier.Name || supplier.hotel_name];
      } else {
        cleanedItem.names.push(supplier.name || supplier.Name || supplier.hotel_name);
      }
      if(!cleanedItem.lat) {
        cleanedItem.lat = supplier.lat || supplier.Latitude || '';
      }
      if(!cleanedItem.lng) {
        cleanedItem.lng = supplier.lng || supplier.Longitude || '';
      }
      if(!cleanedItem.addresses) {
        cleanedItem.addresses = [supplier.address || supplier.Address || (supplier.location && supplier.location.address) || ''];
      } else {
        cleanedItem.addresses.push(supplier.address || supplier.Address || (supplier.location && supplier.location.address) || '');
      }
      if(!cleanedItem.city) {
        cleanedItem.city = Helper.capitalizeFirstLetter(supplier.City || '');
      }
      if(!cleanedItem.country) {
        cleanedItem.country = await Helper.getCountryName(supplier.Country || (supplier.location && supplier.location.country) || '');
      }
      if(!cleanedItem.descriptions) {
        cleanedItem.descriptions = [supplier.info || supplier.Description || supplier.details || ''];
      } else {
        cleanedItem.descriptions.push(supplier.info || supplier.Description || supplier.details || '');
      }
      if(supplier.hasOwnProperty('amenities') && supplier.amenities) {
        if(!cleanedItem.amenitieses) {
          cleanedItem.amenitieses = [Array.isArray(supplier.amenities) ? { "general": supplier.amenities } : supplier.amenities];
        } else {
          cleanedItem.amenitieses.push(Array.isArray(supplier.amenities) ? { "general": supplier.amenities } : supplier.amenities);
        }
      }      
      if(supplier.hasOwnProperty('images')) {
        if(!cleanedItem.imageses) {
          cleanedItem.imageses = [supplier.images];
        } else {
          cleanedItem.imageses.push(supplier.images); 
        }
      }      
      if(!cleanedItem.booking_conditions && supplier.hasOwnProperty('booking_conditions')) {
        cleanedItem.booking_conditions = supplier.booking_conditions || [];            
      }
    }

    cleanedData.push(cleanedItem);
  };

  return cleanedData;
}

function selectBestProperties(cleanedData) {
  const bestProperties = [];

  // Apply criteria to select the best properties
  cleanedData.forEach(item => {
    let bestSupplier = null;
    let bestProperty = null;

    // Rules:
    // 1. Choose the property with the most amenities offered
    Object.keys(item).forEach(key => {
      if (item[key]) {
        if (!bestProperty || item[key].amenities.length > bestProperty.amenities.length) {
          bestSupplier = key;
          bestProperty = item[key];
        }
      }
    });

    if (bestProperty) {
      bestProperties.push({ ...bestProperty, supplier: bestSupplier });
    }
  });

  return bestProperties;
}

const gatherAddresses = (item) => {
  const addresses = [];
  if (item.address) {
    addresses.push(item.address);
  }
  if (item.Address) {
    addresses.push(item.Address);
  }
  if (item.location && item.location.address) {
    addresses.push(item.location.address);
  }
  return addresses;
}

exports.getAllHotels = async () => {
  return await mergeData();
};

exports.getHotelsByDestination = async (destination) => {
    // return await Hotel.find({ location: destination });
};
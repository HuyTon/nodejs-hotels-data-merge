const Helper = require('../../utils/helper');

const sanitizeData = async (groupedData) => {
    const cleanedData = [];
  
    // Parse and clean each item in the grouped data array.
    // Steps: 
    // 1. Standardize Property Names
    // 2. Refrain from selecting "dirty" properties
    // 3. Normalize data formats    
    for (const item of groupedData) {        
      const cleanedItem = {};
  
      // Loop through keys of the item to dynamically determine the supplier
      for (const key of Object.keys(item)) {
        const supplier = item[key];
        
        if(!cleanedItem.id) {
          cleanedItem.id = supplier.id || supplier.Id || supplier.hotel_id;
        }
        if(!cleanedItem.destination_id) {
          cleanedItem.destination_id = supplier.destination || supplier.DestinationId || supplier.destination_id;
        }
        if(!cleanedItem.name) {
          cleanedItem.name = [supplier.name || supplier.Name || supplier.hotel_name];
        } else {
          cleanedItem.name.push(supplier.name || supplier.Name || supplier.hotel_name);
        }
        if(!cleanedItem.location) {
          cleanedItem.location = {};
        }
        if(!cleanedItem.location.lat) {
          cleanedItem.location.lat = supplier.lat || supplier.Latitude || '';
        }
        if(!cleanedItem.location.lng) {
          cleanedItem.location.lng = supplier.lng || supplier.Longitude || '';
        }
        if(!cleanedItem.location.address) {
          cleanedItem.location.address = [supplier.address || supplier.Address || (supplier.location && supplier.location.address) || ''];
        } else {
          cleanedItem.location.address.push(supplier.address || supplier.Address || (supplier.location && supplier.location.address) || '');
        }
        if(!cleanedItem.location.city) {
          cleanedItem.location.city = Helper.capitalizeFirstLetter(supplier.City || '');
        }
        if(!cleanedItem.location.country) {
          cleanedItem.location.country = await Helper.getCountryName(supplier.Country || (supplier.location && supplier.location.country) || '');
        }
        if(!cleanedItem.description) {
          cleanedItem.description = [supplier.info || supplier.Description || supplier.details || ''];
        } else {
          cleanedItem.description.push(supplier.info || supplier.Description || supplier.details || '');
        }
  
        // Merge amenities from suppliers:
        // Combine all general and room from all suppliers' amenities
        if(supplier.hasOwnProperty('amenities') && supplier.amenities) {
          if(supplier.amenities.hasOwnProperty('general')){
            if(!cleanedItem.amenities) {
              cleanedItem.amenities = {
                general: supplier.amenities.general
              };
            } else if (!cleanedItem.amenities.general){
              cleanedItem.amenities.general = supplier.amenities.general;
            } else if (cleanedItem.amenities.general){
              cleanedItem.amenities.general = [...cleanedItem.amenities.general, ...supplier.amenities.general];
            }
          }
          if(supplier.amenities.hasOwnProperty('room')){
            if(!cleanedItem.amenities) {
              cleanedItem.amenities = {
                room: supplier.amenities.room
              };
            } else if (!cleanedItem.amenities.room){
              cleanedItem.amenities.room = supplier.amenities.room;
            } else if (cleanedItem.amenities.room){
              cleanedItem.amenities.room = [...cleanedItem.amenities.room, ...supplier.amenities.room];
            }
          }
          if(!supplier.amenities.hasOwnProperty('general') && !supplier.amenities.hasOwnProperty('room') 
            && Array.isArray(supplier.amenities)) {
            if(!cleanedItem.amenities) {
              cleanedItem.amenities = {
                room: supplier.amenities
              };
            } else if (!cleanedItem.amenities.room){
              cleanedItem.amenities.room = supplier.amenities;
            } else if (cleanedItem.amenities.room){
              cleanedItem.amenities.room = [...cleanedItem.amenities.room, ...supplier.amenities];
            }
          }
        }      
  
        // Merge images from suppliers:
        // Combine all categories from all suppliers' images
        if(supplier.hasOwnProperty('images')) {
          if(supplier.images.hasOwnProperty('rooms')) {
            supplier.images.rooms.forEach((room) => {
              const newRoom = {
                link: room.url || room.link || '',
                description: room.description || room.caption || ''
              }
              if(!cleanedItem.images) {
                cleanedItem.images = {
                  rooms: [newRoom]
                };
              } else if (cleanedItem.images && !cleanedItem.images.rooms){
                cleanedItem.images.rooms = [newRoom];
              } else if (cleanedItem.images && cleanedItem.images.rooms) {
                cleanedItem.images.rooms.push(newRoom);
              }
            });          
          }
          if(supplier.images.hasOwnProperty('site')) {
            supplier.images.site.forEach((site) => {
              const newSite = {
                link: site.url || site.link || '',
                description: site.description || site.caption || ''
              }
              if(!cleanedItem.images) {
                cleanedItem.images = {
                  site: [newSite]
                };
              } else if (cleanedItem.images && !cleanedItem.images.site){
                cleanedItem.images.site = [newSite];
              } else if (cleanedItem.images && cleanedItem.images.site) {
                cleanedItem.images.site.push(newSite);
              }
            });          
          }
          if(supplier.images.hasOwnProperty('amenities')) {
            supplier.images.amenities.forEach((amenity) => {
              const newAmenity = {
                link: amenity.url || amenity.link || '',
                description: amenity.description || amenity.caption || ''
              }
              if(!cleanedItem.images) {
                cleanedItem.images = {
                  amenities: [newAmenity]
                };
              } else if (cleanedItem.images && !cleanedItem.images.amenities){
                cleanedItem.images.amenities = [newAmenity];
              } else if (cleanedItem.images && cleanedItem.images.amenities) {
                cleanedItem.images.amenities.push(newAmenity);
              }
            });          
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

  module.exports = { sanitizeData };
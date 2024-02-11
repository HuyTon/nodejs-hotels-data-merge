const createIdMap = (data) => {    
    if(data) {
        const idMap = new Map();
        data.forEach(item => {
            idMap.set(item.id ? item.id : item.Id ? item.Id : item.hotel_id, item);
        });        
        return idMap;
    }
    return null;
}

const groupById = (acmeMap, patagoniaMap, paperfliesMap) => {
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

module.exports = { createIdMap, groupById };
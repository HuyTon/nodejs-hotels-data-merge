const { mergeData } = require('./mergeData');

module.exports.getAllHotels = async () => {
    return await mergeData();
};

module.exports.getHotelsByDestination = async (destination) => {
    // return await Hotel.find({ location: destination });
};
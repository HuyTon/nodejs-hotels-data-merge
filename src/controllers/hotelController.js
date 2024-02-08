const HotelService = require('../services/hotelService');

exports.getHotels = async (req, res, next) => {
    try {
        const hotels = await HotelService.getAllHotels();
        res.json(hotels);
    } catch (error) {
        next(error);
    }
};

exports.getHotelsByDestination = async (req, res, next) => {
    const destination = req.params.destination;
    try {
        const hotels = await HotelService.getHotelsByDestination(destination);
        res.json(hotels);
    } catch (error) {
        next(error);
    }
};
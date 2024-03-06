const HotelService = require("../services/hotelService");

module.exports.getHotels = async (req, res, next) => {
  try {
    const { destination, hotels } = req.query;

    const hotelsData = await HotelService.getAllHotels();

    if (!hotelsData) {
      fetchDataFailed(res);
    }

    let filteredHotels = hotels
      ? filterHotelsById(hotelsData, hotels)
      : hotelsData;

    filteredHotels = destination
      ? filterHotelsByDestination(filteredHotels, destination)
      : filteredHotels;

    res.json(filteredHotels);
  } catch (error) {
    fetchDataFailed(res, error);
  }
};

const filterHotelsById = (hotelsData, hotelIds) => {
  const ids = hotelIds.split(",").map((id) => id.toLowerCase());
  return hotelsData.filter((hotel) => ids.includes(hotel.id.toLowerCase()));
};

const filterHotelsByDestination = (hotels, destinationId) => {
  return hotels.filter(
    (hotel) => parseInt(hotel.destination_id) == parseInt(destinationId)
  );
};

const fetchDataFailed = (res, error = null) => {
  console.error("Error occurred while fetching hotels:", error);
  res.status(500).json({ error: "An error occurred while fetching hotels" });
};

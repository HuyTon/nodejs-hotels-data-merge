const HotelService = require("../services/hotelService");

module.exports.getHotels = async (req, res, next) => {
  try {
    let { destination, hotels, page = 1, limit = 10 } = req.query;

    // Validate page and limit parameters
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    if (isNaN(limit) || limit < 0) {
      return res.status(400).json({ error: "Invalid limit value" });
    }

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

    const startIndex = (page - 1) * limit;
    const endIndex = limit > 0 ? page * limit : hotelsData.length;

    const hotelsSubset = filteredHotels.slice(startIndex, endIndex);

    res.json(hotelsSubset);
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

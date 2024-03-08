const HotelService = require("../services/hotelService");

module.exports.getHotels = async (req, res, next) => {
  try {
    let { destination, hotels, amenities, page = 1, limit = 10 } = req.query;

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
      return;
    }

    // Filter hotels by IDs
    let filteredHotels = hotels
      ? filterHotelsById(hotelsData, hotels)
      : hotelsData;

    // Filter hotels by destination ID
    if (destination) {
      filteredHotels = filterHotelsByDestination(filteredHotels, destination);
    }

    // Filter hotels by amenities
    if (amenities) {
      filteredHotels = filterHotelsByAmenities(filteredHotels, amenities);
    }

    // Calculate start and end of indexes for pagination
    const startIndex = (page - 1) * limit;
    const endIndex = limit > 0 ? page * limit : filteredHotels.length;

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

const filterHotelsByAmenities = (hotels, amenities) => {
  const filteredHotels = [];
  const matchedHotels = [];

  const amenityArray = amenities
    .split(",")
    .map((amenity) => amenity.toLowerCase());

  if (amenityArray.length === 0) {
    return hotels;
  }

  hotels.forEach((hotel) => {
    const matchedGeneralCount = hotel.amenities.general
      ? countMatchedAmenities(amenityArray, hotel.amenities.general)
      : 0;

    const matchedRoomCount = hotel.amenities.room
      ? countMatchedAmenities(amenityArray, hotel.amenities.room)
      : 0;

    const matchedTotalCount = matchedGeneralCount + matchedRoomCount;

    if (matchedTotalCount > 0) {
      matchedHotels.push({
        hotel: hotel,
        matchedCount: matchedTotalCount,
      });
    }
  });

  matchedHotels.sort((a, b) => {
    return b.matchedCount >= a.matchedCount ? 1 : -1;
  });

  matchedHotels.forEach((hotel) => {
    filteredHotels.push(hotel.hotel);
  });

  return filteredHotels;
};

const countMatchedAmenities = (arr1, arr2) => {
  let count = 0;
  for (const element of arr1) {
    if (arr2.includes(element.toLowerCase())) {
      count++;
    }
  }
  return count;
};

const fetchDataFailed = (res, error = null) => {
  console.error("Error occurred while fetching hotels:", error);
  res.status(500).json({ error: "An error occurred while fetching hotels" });
};

const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

router.get('/hotels', hotelController.getHotels);
router.get('/hotels/:destination', hotelController.getHotelsByDestination);

module.exports = router;
const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");
const redisCacheMiddleware = require("../middlewares/redisCacheMiddleware");

router.get("/hotels", redisCacheMiddleware(), hotelController.getHotels);

module.exports = router;

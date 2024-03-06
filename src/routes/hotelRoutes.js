const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");
const redisCacheMiddleware = require("../middlewares/redisCacheMiddleware");

router.get(
  "/hotels",
  redisCacheMiddleware({
    options: {
      EX: 43200, // 12h
      NX: false, // write the data even if the key already exists
    },
  }),
  hotelController.getHotels
);

module.exports = router;

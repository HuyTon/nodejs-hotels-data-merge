const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const config = require("config");
const hotelRoutes = require("./src/routes/hotelRoutes");
const errorHandler = require("./src/utils/errorHandler");
const redisCacheUtils = require("./src/utils/redisCacheUtils");
const loggingMiddleware = require("./src/middlewares/loggingMiddleware");
const logger = require("./src/utils/loggingUtils");
// const mysql = require("mysql");
const { validateApiKey } = require("./src/middlewares/authMiddleware");

const app = express();

const PORT = process.env.PORT || config.get("port");

// Initialize and connect to Redis
redisCacheUtils.initializeRedisClient();

// Create a connection to the MySQL database
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// Connect to the database
// connection.connect((err) => {
//   if (err) {
//     logger.error(`Error connecting to MySQL database: ${err.message}`);
//     return;
//   }
//   logger.info("Connected to the MySQL server.");
// });

// Use logging middleware

app.use(loggingMiddleware);

// Enable body parser
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// 1. Access to the hotel's APIs without requires a valid API key
app.use("/api", hotelRoutes);

// 2. Access to the hotel's APIs requires a valid API key
// app.use("/api", validateApiKey, hotelRoutes);

app.use(errorHandler);

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));

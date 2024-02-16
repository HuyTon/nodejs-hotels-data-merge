const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const config = require("config");
const hotelRoutes = require("./src/routes/hotelRoutes");
const errorHandler = require("./src/utils/errorHandler");

const app = express();

const PORT = process.env.PORT || config.get("port");

// Enable body parser
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", hotelRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

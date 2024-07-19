


const express = require("express");
const seedUsers = require("../controllers/seedController");
const upload = require("../middleware/uploadFiles");
const seedRouter = express.Router();

seedRouter.get('/users',upload.single("image"), seedUsers); // Correctly define the route

module.exports = seedRouter;

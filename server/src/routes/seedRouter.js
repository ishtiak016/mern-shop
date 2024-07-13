


const express = require("express");
const seedUsers = require("../controllers/seedController");
const seedRouter = express.Router();

seedRouter.get('/users', seedUsers); // Correctly define the route

module.exports = seedRouter;

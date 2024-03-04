const express = require("express");
const { saveSeeder } = require("../controllers/seeder/seederController");
const route = express.Router();

route.get("/", saveSeeder);

module.exports = route;

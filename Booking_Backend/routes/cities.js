var express = require("express");
var router = express.Router();

const CitiesCounter = require("../controllers/cities");

/* GET home page. */
router.get("/", CitiesCounter.All_Available_cities);

module.exports = router;

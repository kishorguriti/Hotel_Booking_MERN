const HotelModel = require("../models/hotel");

const All_Available_cities = async (req, res, next) => {
  let searchEntry = req.query?.city;
  try {
    let allHotels = await HotelModel.find();
    let CitiesArray = [];
    let cities = await Promise.all(
      allHotels.map((each) => {
        if (CitiesArray.includes(each.city)) {
          return;
        } else {
          CitiesArray.push(each.city);
        }
      })
    );
    let filteredCities = CitiesArray.filter((each) => {
      return each.includes(searchEntry);
    });
    return res.send(filteredCities);
  } catch (error) {
    next(error);
  }
};

module.exports = { All_Available_cities };

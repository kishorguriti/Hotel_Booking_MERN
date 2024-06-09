const HotelModel = require("../models/hotel");
const RoomsModel = require("../models/room");

const createNewHotel = async function (req, res, next) {
  let body = req.body;

  let hotelExist = await HotelModel.find({ name: body.name });

  if (hotelExist.length !== 0) {
    return res.send("Hotel already added ");
  }

  const newHotel = new HotelModel(body);
  try {
    const saveHotel = await newHotel.save();
    return res.status(200).send(saveHotel);
  } catch (Err) {
    return res.status(400).send(Err);
    // next(Err); // this is the next middleware written in app.js file
  }
};

const updateHotel = async function (req, res, next) {
  let { id } = req.params;
  let body = req.body;
  try {
    let updatedHotel = await HotelModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return res.status(200).send(updatedHotel);
  } catch (err) {
    next(err); // this is the next middleware written in app.js file
  }
};

const addReview = async (req, res, next) => {
  let hotelid = req.params.hotelId;
 
  let body = req.body;
  
  try {
    let hotel = await HotelModel.findByIdAndUpdate(
      hotelid,

      {
        $push: { reviews: body },
      },
      {
        new: true,
      }
    );
    // await hotel.save();

    return res.send(hotel);
  } catch (error) {
    return res.send(error);
  }
};

const deleteHotel = async function (req, res, next) {
  let id = req.params.id;

  try {
    let deletedHotel = await HotelModel.findByIdAndDelete(id);
    return res.status(200).send("Hotel removed");
  } catch (err) {
    next(err); // this is the next middleware written in app.js file
  }
};

const GetOneHotel = async function (req, res, next) {
  const { id } = req.params;

  try {
    let singleHotel = await HotelModel.findById({ _id: id });
    return res.status(200).send(singleHotel);
  } catch (err) {
    next(err); // this is the next middleware written in app.js file
  }
};

const AllHotels = async function (req, res, next) {
  let id = req.params.id;

  try {
    let Hotels = await HotelModel.find();
    return res.status(200).send(Hotels);
  } catch (err) {
    next(err); // this is the next middleware written in app.js file
  }
};

const CountByCities = async (req, res) => {
 
  let cities = req.query.cities.split(",");
  try {
    let hotelsCount = await Promise.all(
      cities.map(async (city) => {
        const count = await HotelModel.countDocuments({ city: city });
        return { label: city, value: count };
      })
    );
    return res.send(hotelsCount);
  } catch (err) {
    return res.send(err);
  }
};

const CountBytype = async (req, res, next) => {
  try {
    let HotelTypeCount = await HotelModel.countDocuments({ type: "hotel" });
    let ApartmentTypeCount = await HotelModel.countDocuments({
      type: "apartment",
    });
    let VillaTypeCount = await HotelModel.countDocuments({
      type: "villa",
    });
    let CabinTypeCount = await HotelModel.countDocuments({
      type: "cabin",
    });
    let ResortTypeCount = await HotelModel.countDocuments({
      type: "resort",
    });
    return res.send([
      {
        hotelCount: HotelTypeCount,
        apartmentCount: ApartmentTypeCount,
        villaCount: VillaTypeCount,
        cabinCount: CabinTypeCount,
        resortCount: ResortTypeCount,
      },
    ]);
  } catch (err) {
    next(404);
  }
};


const hotelsinCity = async (req, res, next) => {
  let city = req.query.city;
  const daysDiff=parseInt(req.query.daysDiff);
  let minPrice = parseInt(req.query.min)/daysDiff;
  let maxPrice = parseInt(req.query.max)/daysDiff; 
 
  if (minPrice || maxPrice) {
    try {
      let allHotels = await HotelModel.aggregate([
        {
          $match: {
            city: city,
            cheapestPrice: {
              $gte: minPrice || 1000,
              $lte: maxPrice || 4000000,
            },
          },
        },
      ]);

      return res.send(allHotels);
    } catch (err) {
      res.send(err);
    }
  } else {
    try {
      let allHotels = await HotelModel.find({ city: city });
      return res.send(allHotels);
    } catch (err) {
      return res.send(err);
    }
  }
};

//count by type and city

const CountBytypeAndCity = async (req, res, next) => {
  let city = req.query.city;

  try {
    let HotelTypeCount = await HotelModel.countDocuments({
      type: "hotel",
      city: city,
    });
    let ApartmentTypeCount = await HotelModel.countDocuments({
      type: "apartment",
      city: city,
    });
    let VillaTypeCount = await HotelModel.countDocuments({
      type: "villa",
      city: city,
    });
    let CabinTypeCount = await HotelModel.countDocuments({
      type: "cabin",
      city: city,
    });
    let ResortTypeCount = await HotelModel.countDocuments({
      type: "resort",
      city: city,
    });
    return res.send([
      {
        city: city,
        counts: [
          { label: "Hotel", value: HotelTypeCount },
          { label: "Apartments", value: ApartmentTypeCount },
          { label: "Villa", value: VillaTypeCount },
          { label: "Cabin", value: CabinTypeCount },
          { label: "Resort", value: ResortTypeCount },
        ],
      },
    ]);
  } catch (err) {
    return res.send(err);
  }
};

const overAllcountBytypeAndCity = async (req, res, next) => {
  let cities = new Set(req.query.cities.split(","));
  cities = Array(...cities);
  try {
    let OverAll_Count_By_type_and_city_Array = [];

    let OverAll_Count_By_type_and_city = await Promise.all(
      cities.map(async (city) => {
        let HotelTypeCount = await HotelModel.countDocuments({
          type: "hotel",
          city: city,
        });
        let ApartmentTypeCount = await HotelModel.countDocuments({
          type: "apartment",
          city: city,
        });
        let VillaTypeCount = await HotelModel.countDocuments({
          type: "villa",
          city: city,
        });
        let CabinTypeCount = await HotelModel.countDocuments({
          type: "cabin",
          city: city,
        });
        let ResortTypeCount = await HotelModel.countDocuments({
          type: "resort",
          city: city,
        });

        let Count_By_type_and_city_obj = {
          city: city,
          counts: [
            { label: "Hotel", value: HotelTypeCount },
            { label: "Apartments", value: ApartmentTypeCount },
            { label: "Villa", value: VillaTypeCount },
            { label: "Cabin", value: CabinTypeCount },
            { label: "Resort", value: ResortTypeCount },
          ],
        };

        OverAll_Count_By_type_and_city_Array.push(Count_By_type_and_city_obj);
      
        return OverAll_Count_By_type_and_city_Array;
      })
    );

    return res.send(OverAll_Count_By_type_and_city[0]);
  } catch (err) {
    return res.send(err);
  }
};

// based on the city entered all the data should be returned and price should be added based on the cheapestprice+2000

const addPrice = async (req, res, next) => {
  let city = req.query.city;
  let body = req.body;

  try {
    let response = await HotelModel.updateMany(
      { type: "hotel" },

      { $set: { photos: body.photos } }
    );

    return res.send(response);
  } catch (err) {
    res.send(err);
  }
};

const updateAllHotels = async (req, res, next) => {
  let allHotels = await HotelModel.find();

  try {
    let updateHotel = await Promise.all(
      allHotels.map(async (eachHotel) => {
        return await HotelModel.findByIdAndUpdate(
          eachHotel._id.toString(),
          {
            $set: { rooms: [] },
          },
          { new: true }
        );
      })
    );
    return res.send(updateHotel);
  } catch (err) {
    return res.send(err);
  }
};

const BookedHotels = async (req, res, next) => {
  try {
    let allHotels = await HotelModel.find();

    let BookedHotesList = await Promise.all(
      allHotels.map(async (hotel) => {
        const rooms = hotel.rooms.map(async (roomid) => {
          return await RoomsModel.findById(roomid);
        });

        const AllRooms = await Promise.all(rooms);

        let BookedRooms = AllRooms.some((room) => {
          return room.roomNumbers.some((each) => {
            return each.unavailableDates.length > 0;
          });
        });

        if (BookedRooms) {
          return hotel;
        } else {
          return null;
        }
      })
    );

    BookedHotesList = BookedHotesList.filter((each) => each !== null);
    return res.send(BookedHotesList);
  } catch (err) {
    return res.send(er);
  }
};

const userBookedHotels = async (req, res, next) => {
  try {
    let hotelIdsArray = req.query.hotelIds.split(",");
    if (hotelIdsArray.length === 0) {
      return res.send("no Booked data");
    }

    let bookedHotels = await Promise.all(
      hotelIdsArray.map(async (each) => {
        return await HotelModel.findById(each);
      })
    );
    return res.send(bookedHotels);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createNewHotel,
  updateHotel,
  deleteHotel,
  GetOneHotel,
  AllHotels,
  CountByCities,
  CountBytype,
  CountBytypeAndCity,
  hotelsinCity,
  addPrice,
  updateAllHotels,
  BookedHotels,
  userBookedHotels,
  overAllcountBytypeAndCity,
  addReview,
};

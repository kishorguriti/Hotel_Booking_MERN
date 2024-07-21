var express = require("express");
var router = express.Router();
var hotelsController = require("../controllers/hotel");
var authController = require("../controllers/auth");


/* GET users listing. */
router.get("/", hotelsController.AllHotels);
router.get("/find/:id", hotelsController.GetOneHotel);
router.post(
  "/newhotel",
  //authController.authenticate,
  hotelsController.createNewHotel
);
router.put(
  "/:id",
  //authController.authenticate,
  hotelsController.updateHotel
);
router.delete(
  "/:id",
  //authController.authenticate,
  hotelsController.deleteHotel
);
router.get("/countbycity", hotelsController.CountByCities);

router.get("/countbytype", hotelsController.CountBytype);
router.get('/type', hotelsController.getByType)
router.get("/countbytypeandcity", hotelsController.CountBytypeAndCity);
router.get("/city", hotelsController.hotelsinCity);
router.put("/city/price", hotelsController.addPrice);
router.put("/", hotelsController.updateAllHotels);
router.get("/booked/list", hotelsController.BookedHotels);
router.get("/user/booked", hotelsController.userBookedHotels);
router.get(
  "/OverAllcountbytypeandcity",
  hotelsController.overAllcountBytypeAndCity
);
router.put("/review/:hotelId", hotelsController.addReview);
module.exports = router;

const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const {
  CreateNewRoom,
  updateRoom,
  AllRooms,
  singleRoom,
  DeleteRoom,
  AllRoomsInHotel,
  dummyRoute,
  dummyDelete,
  bookRoom,
  accessingRoom,
  sendEmail,
  cancelRoom,
} = require("../controllers/room");

// router.use(authController.authenticate);

router.post("/newroom/:hotelid", CreateNewRoom);
router.put("/update/:id/:hotelid", updateRoom);
router.get("/:hotelId", AllRoomsInHotel);
router.get("/find/:roomid/:hotelid", singleRoom);
router.delete("/delete/:id/:hotelid", DeleteRoom);
router.put("/addroom", dummyRoute);
router.delete("/deleteroom/:id", dummyDelete);
router.put("/book/:hotelid", bookRoom);
router.post("/book/email", sendEmail);
router.put("/cancel", cancelRoom);

module.exports = router;

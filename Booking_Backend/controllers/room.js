var RoomsModel = require("../models/room");
var HotelModel = require("../models/hotel");
var nodemailer = require("nodemailer");
const UserModel = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const Handlebars = require("handlebars");

const CreateNewRoom = async (req, res, next) => {
  const roomdetails = req.body;
  const room = new RoomsModel(roomdetails);

  const hotelId = req.params.hotelid;

  try {
    const savedRoom = await room.save();

    try {
      await HotelModel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).send(savedRoom);
  } catch (err) {
    next(err);
  }
};

const updateRoom = async (req, res, next) => {
  let roomId = req.params.id;
  let hotelId = req.params.hotelid;
  let body = req.body;

  try {
    let hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return res.send("Hotel not found");
    }
    let room = await Promise.all(
      hotel.rooms.map((each) => {
        return RoomsModel.findById(each);
      })
    );

    if (!room) {
      return res.send("Room Not found");
    }
    let updatedRoom = await RoomsModel.findByIdAndUpdate(roomId, body);

    await hotel.save();

    return res.send(hotel);
  } catch (err) {
    return res.send(err);
  }
};

const AllRoomsInHotel = async (req, res, next) => {
  let hotlId = req.params.hotelId;

  try {
    let hotel = await HotelModel.findById(hotlId);

    let allRooms = await Promise.all(
      hotel.rooms.map((each) => {
        return RoomsModel.findById(each);
      })
    );
    return res.status(200).send(allRooms);
  } catch (err) {
    next(err);
  }
};

const singleRoom = async function (req, res, next) {
  let roomId = req.params.roomid;
  let hotelId = req.params.hotelid;

  try {
    let hotel = await HotelModel.findById(hotelId);

    if (!hotel) {
      return res.send("Hotel not found");
    }

    let room = await Promise.all(
      hotel.rooms.map((each) => {
        return RoomsModel.findById(each);
      })
    );

    return res.send(room);
  } catch (err) {
    next(err);
  }
};

const DeleteRoom = async (req, res, next) => {
  let id = req.params.id;
  let hotelId = req.params.hotelid;

  try {
    await RoomsModel.findByIdAndDelete(id);

    try {
      await HotelModel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: id },
      });
    } catch (err) {
      next(err);
    }

    return res.status(200).send();
  } catch (err) {
    next(err);
  }
};

const dummyRoute = async (req, res, next) => {
  try {
    let roomdetails = new RoomsModel(req.body);
    await roomdetails.save();
    let allHotels = await HotelModel.find();
    let updateHotel = await Promise.all(
      allHotels.map((each) => {
        return HotelModel.findByIdAndUpdate(each._id, {
          $push: { rooms: roomdetails._id },
        });
      })
    );

    return res.send(updateHotel);
  } catch (err) {
    return res.send("this is catch");
  }
};

const dummyDelete = async (req, res, next) => {
  let roomId = req.params.id;

  let allHotels = await HotelModel.find();

  try {
    let deleted = await Promise.all(
      allHotels.map((each) => {
        return HotelModel.findByIdAndUpdate(each._id, {
          $pull: { rooms: roomId },
        });
      })
    );
    return res.send(deleted);
  } catch (err) {
    return res.send("err");
  }
};

const bookRoom = async (req, res, next) => {
  let hotelId = req.params.hotelid;
  let roomId = req.query.roomid;
  let selectedDates = req.body.selectedDates;
  if (roomId === null) {
    next();
  }
  try {
    let hotel = await HotelModel.findById(hotelId);

    if (hotel.length === 0) {
      return res.send({ result: "hotel not found" });
    } else {
      let categoryRooms = await Promise.all(
        hotel.rooms.map(async (catRoomId) => {
          return await RoomsModel.findById(catRoomId);
        })
      );

      if (categoryRooms.length === 0) {
        return res.send({ result: "Room was not Found" });
      } else {
        let selectedIndividualRoom = await Promise.all(
          categoryRooms.map((eachcatroom) => {
            return eachcatroom.roomNumbers.filter((eachIndRoom) => {
              return eachIndRoom._id.toString() === roomId;
            });
          })
        );

        selectedIndividualRoom = selectedIndividualRoom.filter((each) => {
          return each.length !== 0;
        });

        let updatedRoomdata = await RoomsModel.updateOne(
          { "roomNumbers._id": roomId },
          {
            $addToSet: {
              "roomNumbers.$.unavailableDates": { $each: selectedDates },
            },
          }
          // {
          //   $set: { "roomNumbers.$.unavailableDates": [] }, //set is to update,  push is to push the data // addToset is push date only it doesnot exist in the array
          // }
        );

        selectedIndividualRoom[0][0].unavailableDates = selectedDates;

        await hotel.save();

        return res.send(selectedIndividualRoom);
      }
    }
  } catch (err) {
    next(err);
  }
};

const sendEmail = async (req, res, next) => {
  let BookedHotelid = req.body.BookedHotelid;
  let userBookingdetails = req.body.userBookingdetails;
  let userDetailsObj = req.body.userDetails;
  //console.log(userBookingdetails ,'user booking')

  let unqNum = uuidv4().replace(/\D/g, "").slice(0, 12);
  let hotelDetails = req.body.hotelDetails;
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kishorguriti119@gmail.com",
        pass: "tgrjdzrdscvivzdf",
      },
    });

    var mailOptions = {
      from: '"Booking.com" <kishorguriti119@gmail.com>',
      to: `${userDetailsObj?.email}`,
      subject: "Booking Successful",
      text: "Email functionality checking",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 8px auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #003580;
            color: #fff;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            border-radius: 3px;
        }
        .header h1 {
            flex: 1 1 100%;

        }
            .logo{
            height:40px;
            width:40px
            }
        .header .contact-info {
            flex: 1 1 100%;
           
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            /* color: #007BFF; */
        }
        .content p {
            margin: 10px 0;
        }
        .content .info {
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .content .info h3 {
            margin-top: 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            background-color: #007BFF;
            color: #fff;
            text-align: center;
            border-radius: 5px;
            text-decoration: none;
            min-width: 230px;
        }
        .map img {
            width: 48%;
            height: 90%;
            max-height: 150px;
            border-radius: 5px;
            display: inline-block;
            vertical-align: top;
        }
        .reservation-details {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
        }
        .reservation-details span {
            display: inline-block;
            border-bottom: 1px solid #ccc;
            width: 45%;
            margin: 5px 0;
        }
        .left {
            text-align: left;
            
        }
        .right {
            text-align: right;
            align-self:flex-end
        }
        @media (max-width: 600px) {
            .content {
                padding: 5px;
            }
            .button {
                padding: 10px;
            }
            .map img {
                width: 100%;
                margin-bottom: 10px;
                max-height: 150px;
            }
            .reservation-details {
                flex-direction: column;
            }
            .reservation-details span {
                width: 100%;
            }
            .header {
                display: block;
            }
            .header .contact-info {
                margin-top: 10px;
            }
        }
        @media (min-width: 601px) {
            .header {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }
            .header h1 {
                flex: 0 0 auto;
                margin-right: auto;
            }
            .header .contact-info {
                flex: 0 0 auto;
            }
        }
        p span {
            font-size: 14px !important;
        }
    </style>
</head>
<body>
    <div class="container" id="reportContent">
        <div class="header">
            <h1>
            Booking.com
            </h1>
            
            <div class="contact-info">
                <p>Confirmation number: ${unqNum}</p>
            </div>
        </div>
        <div class="content">
        <p>Hi, ${userDetailsObj.username},</p>
            <p>Your booking in <b>${hotelDetails.name}</b> is confirmed</p>
            <span>${hotelDetails.name} is expecting you Check-in on <b>${
        userBookingdetails.unavailableDates[0]
      }</b></span>
            <span>Please find more details in the payment section below</span>
            <span>Make changes to your booking or ask the property a question in just a few clicks</span>
            <div class="info">
                <h4>${hotelDetails?.name}</h4>
                <p>${hotelDetails?.address}</p>
                <p>Phone:${hotelDetails?.OwnerInfo?.ownerContactNo}</p>
                <div class="map">
                    <img src="${hotelDetails?.photos[0]}" alt="${hotelDetails?.name}">
                    <img src="${hotelDetails?.photos[1]}" alt="${hotelDetails?.name}">
                </div>
            </div>
            <div class="info">
                <div class="reservation-details">
                    <span class="left"><strong>Your reservation:</strong></span>
                    <span class="right">1 night,</span>
                </div>
                <div class="reservation-details">
                    <span class="left"><strong>Check-in:</strong></span>
                    <span class="right">${
                      userBookingdetails.unavailableDates[0]
                    }</span>
                </div>
                <div class="reservation-details">
                    <span class="left"><strong>Check-out:</strong></span>
                    <span class="right">${
                      userBookingdetails.unavailableDates[
                        userBookingdetails.unavailableDates.length - 1
                      ]
                    }</span>
                </div>
                <div class="reservation-details">
                    <span class="left"><strong>Prepayment:</strong></span>
                    <span class="right">Done</span>
                </div>
                <div class="reservation-details">
                    <span class="left"><strong>Cancellation cost:</strong></span>
                    <span class="right"><a href='#'>as per cancellation Policy</a></span>
                </div>
               <a href="http://localhost:3000/Booking.com/user/${
                 userDetailsObj.username
               }/profile/bookings?status=upcoming" class="button" style="color:white;background-color: #FF0000;">Cancel your booking</a>

                <p style="color: #FF0000;">This booking is non-refundable. Changing the dates of your stay is not possible.</p>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.0.0-alpha.12/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const { jsPDF } = window.jspdf;

            document.getElementById('downloadBtn').addEventListener('click', function (event) {
                event.preventDefault();
                html2canvas(document.getElementById('reportContent')).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF();
                    const imgProps= pdf.getImageProperties(imgData);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save('booking_confirmation.pdf');
                });
            });
        });
    </script>
</body>
</html>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send(error.toString());
      } else {
        // res.status(200).send("Email sent: " + info.response);
      }
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

const cancelRoom = async (req, res, next) => {
  let bookingObj = {
    number: req.body.number,
    unavailableDates: req.body.unavailableDates,
    _id: req.body._id,
    hotelId: req.body.hotelId,
  };
  try {
    let hotel = await HotelModel.findById(req.body.hotelId);
    if (!hotel) {
      return res.send("no hotel found");
    }
    let allRooms = await Promise.all(
      hotel.rooms.map(async (roomid) => {
        return await RoomsModel.findById(roomid);
      })
    );
    let updatedRoomsAfterCancell = await RoomsModel.findOneAndUpdate(
      {
        "roomNumbers._id": req.body._id,
      },
      {
        $pull: {
          "roomNumbers.$.unavailableDates": {
            $in: req.body.unavailableDates,
          },
        },
      }
    );
    let updateduser = await UserModel.findById(req.body.userId);
    if (!updateduser) {
      return res.send(" user not exist ");
    }

    let updateduserBookings = updateduser.BookingDetails.filter((each) => {
      return JSON.stringify(each) !== JSON.stringify(bookingObj);
    });

    let allUsersAfterUpdate = await UserModel.findByIdAndUpdate(
      req.body.userId,
      { BookingDetails: updateduserBookings }
    );
    await allUsersAfterUpdate.save();

    await hotel.save();
    console.log("try");
    return res.send({ result: "succuss" });
  } catch (err) {
    console.log("err");
    return res.send(err);
  }
};

module.exports = {
  CreateNewRoom,
  updateRoom,
  singleRoom,
  DeleteRoom,
  AllRoomsInHotel,
  dummyRoute,
  dummyDelete,
  bookRoom,
  sendEmail,
  cancelRoom,
};

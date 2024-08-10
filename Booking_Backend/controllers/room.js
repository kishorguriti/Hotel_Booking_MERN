var RoomsModel = require("../models/room");
var HotelModel = require("../models/hotel");
var nodemailer = require("nodemailer");
const UserModel = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const Handlebars = require('handlebars');

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





// const sendEmail = async (req, res, next) => {
//   const { BookedHotelid, userBookingdetails, hotelDetails } = req.body;

//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'kishorguriti119@gmail.com',
//         pass: 'tgrjdzrdscvivzdf',
//       },
//     });

//     // Sample data with 7 rows and 7 columns
//     const data = {
//       headers: Array.from({ length: 10 }, (_, i) => `Field ${i + 1}`),
//       customers: Array.from({ length: 10 }, (_, i) => {
//         const row = {};
//         for (let j = 1; j <= 10; j++) {
//           row[`field${j}`] = `Data${j}_${i + 1}`;
//         }
//         return row;
//       }),
//     };

//     const templateSource = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>CRM Status Email</title>
//         <style>
//         body {
//           font-family: Arial, sans-serif;
//         }

//        .card-container {
//   display: flex;
//   flex-wrap: wrap;
//   margin-bottom: 20px;
//   gap:10px;
// }

// .card {
//   border: 1px solid #dddddd;
//   border-radius: 5px;
//   padding: 10px;
//   width: 200px;
//   min-width:200px;
//   height: 80px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   margin-right: 10px; 
//   margin-bottom: 10px; 
// }
       

//         .card h2 {
//           font-size: 18px;
//           margin-bottom: 10px;
//         }

//         .card p {
//           font-size: 24px;
//           font-weight: bold;
//           margin: 0;
//         }

//         .table-container {
//           width: 100%;
//         }

//         table {
//           width: 90%;
//            overflow-x: auto;
//           border-collapse: collapse;
//           min-width: 800px;
//         }

//         th, td {
//           padding: 5px;
//           border: 1px solid #dddddd;
//           text-align: left;
//           white-space: nowrap;
//         }

//         th {
//           background-color: #f2f2f2;
//         }

//         @media (max-width: 600px) {
//           .table {
//             overflow-x: auto;
//             -webkit-overflow-scrolling: touch;
//             width:90%
//           }

//           table-container {
//             width: 100%;
//           }
//         }
//         </style>
//     </head>
//     <body>
//         <h1>CRM Status Report</h1>
//         <div class="card-container">
//           <div class="card" style="background-color: #DCFCE7">
//             <h2>Clients</h2>
//             <p>230</p>
//           </div>
//           <div class="card" style="background-color: #FFE2E5">
//             <h2>Campaigns</h2>
//             <p>200</p>
//           </div>
//           <div class="card" style="background-color: #FFF4DE">
//             <h2>Card 4</h2>
//             <p>47</p>
//           </div>
//         </div>
//         <div class="table-container">
//           <table>
//             <thead>
//               <tr>
//                 {{#each headers}}
//                 <th>{{this}}</th>
//                 {{/each}}
//               </tr>
//             </thead>
//             <tbody>
//               {{#each customers}}
//               <tr>
//                 {{#each this}}
//                 <td>{{this}}</td>
//                 {{/each}}
//               </tr>
//               {{/each}}
//             </tbody>
//           </table>
//         </div>
// <h1 style="margin-bottom:20px">BDM Report</h1>
//         <div class="table-container">
//           <table>
//             <thead>
//               <tr>
//                 {{#each headers}}
//                 <th>{{this}}</th>
//                 {{/each}}
//               </tr>
//             </thead>
//             <tbody>
//               {{#each customers}}
//               <tr>
//                 {{#each this}}
//                 <td>{{this}}</td>
//                 {{/each}}
//               </tr>
//               {{/each}}
//             </tbody>
//           </table>
//         </div>
//     </body>
//     </html>
//     `;

//     // Compile the template
//     const template = Handlebars.compile(templateSource);
//     const htmlContent = template(data);  // this data should contain empReports and BdmReports

//     const mailOptions = {
//       from: 'Rajeshnasina123@gmail.com',
//       to: 'kishorguriti119@gmail.com',
//       subject: 'Booking Successful',
//       text: 'Email functionality checking',
//       html: htmlContent,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//         res.status(500).send(error.toString());
//       } else {
//         console.log('Email sent: ' + info.response);
//         res.status(200).send('Email sent: ' + info.response);
//       }
//     });
//   } catch (err) {
//     next(err);
//     console.log(err);
//   }
// };









//---------------------------------------------------------- original ------------------------------------------------
const sendEmail = async (req, res, next) => {
  let BookedHotelid = req.body.BookedHotelid;
  let userBookingdetails = req.body.userBookingdetails;
  // console.log(userBookingdetails ,'user booking')
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
      from: "Rajeshnasina123@gmail.com",
      to: "kishorguriti119@gmail.com",
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
                align-items: flex-start;
            }
            .reservation-details span {
                width: 100%;
                text-align: left;
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
            <h1>Booking.com</h1>
            <div class="contact-info">
                <p>Confirmation number: 3860300137</p>
                <p>PIN code: 4591</p>
            </div>
        </div>
        <div class="content">
            <p>Your booking in <b>${hotelDetails.name}</b> is confirmed</p>
            <p>Tdp's Kishor Hostel is expecting you on 14 June</p>
            <p>Your payment will be handled by Tdp's Kishor Hostel. The 'Payment' section below has more details</p>
            <p>Make changes to your booking or ask the property a question in just a few clicks</p>
            <div class="info">
                <h4>${hotelDetails?.name}</h4>
                <p>${hotelDetails?.address}</p>
                <p>Phone: +123456789</p>
                <div class="map">
                    <img src="${hotelDetails?.photos[0]}" alt="Map 1">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbBIfEn6WH8VdKWGPrlajoydjrGs2VHYfuqQ&s" alt="Map 2">
                </div>
            </div>
            <div class="info">
                <div class="reservation-details">
                    <span class="left"><strong>Your reservation:</strong></span>
                    <span class="right">1 night, 1 dormitory bed</span>
                </div>
                <div class="reservation-details">
                    <span class="left"><strong>Check-in:</strong></span>
                    <span class="right">${userBookingdetails.unavailableDates[0]}</span>
                </div>
                <div class="reservation-details">
                    <span class="left"><strong>Check-out:</strong></span>
                    <span class="right">${userBookingdetails.unavailableDates[userBookingdetails.unavailableDates.length - 1]}</span>
                </div>
                <div class="reservation-details">
                    <span class="left"><strong>Prepayment:</strong></span>
                    <span class="right">You will be charged a prepayment of the total price at any time.</span>
                </div>
                <div class="reservation-details">
                    <span class="left"><strong>Cancellation cost:</strong></span>
                    <span class="right">From now on: rs 0001</span>
                </div>
               <a href="http://localhost:3000/Booking.com/user/naidu/profile/bookings?status=upcoming" class="button" style="color:white;background-color: #FF0000;">Cancel your booking</a>

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
</html>`
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







// const sendEmail = async (req, res, next) => {
//   let BookedHotelid = req.body.BookedHotelid;
//   let userBookingdetails = req.body.userBookingdetails;
//   let hotelDetails = req.body.hotelDetails;
//   let userDetails = req.body.userDetails;
//   let userEmail = req.body.userDetails.email;
//   try {
//     var transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "kishorguriti119@gmail.com",
//         pass: "tgrjdzrdscvivzdf",
//       },
//     });

//     const downloadHtml = `<!DOCTYPE html>
// <html>
// <head>
//     <title>Download HTML as PDF</title>
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             background-color: #f4f4f4;
//             color: #333;
//         }
//         .container {
//             width: 80%;
//             margin: 0 auto;
//             background-color: #fff;
//             padding: 20px;
//             border-radius: 10px;
//             box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//         }
//         .header {
//             text-align: center;
//             padding: 10px 0;
//             background-color: #007BFF;
//             color: #fff;
//             border-radius: 10px 10px 0 0;
//         }
//         .content {
//             padding: 20px;
//         }
//         .footer {
//             text-align: center;
//             padding: 10px 0;
//             background-color: #007BFF;
//             color: #fff;
//             border-radius: 0 0 10px 10px;
//         }
//     </style>
// </head>
// <body>
//     <div class="container" id="content">
//         <div class="header">
//             <h1>Welcome to Our Service</h1>
//         </div>
//         <div class="content">
//             <p>Hello,</p>
//             <p>Thank you for joining our service. We're excited to have you on board!</p>
//             <p>If you have any questions, feel free to contact us at any time.</p>
//         </div>
//         <div class="footer">
//             <p>&copy; 2024 Our Company</p>
//         </div>
//     </div>
//     <button onclick="downloadPDF()">Download as PDF</button>

//     <script>
//         function downloadPDF() {
//             const { jsPDF } = window.jspdf;
//             const doc = new jsPDF();

//             // Source HTMLElement or a string containing HTML.
//             const content = document.getElementById('content');
            
//             doc.html(content, {
//                 callback: function (doc) {
//                     doc.save('content.pdf');
//                 },
//                 x: 10,
//                 y: 10
//             });
//         }
//     </script>
// </body>
// </html>
// `;

//     const logourl = `https://pbs.twimg.com/profile_images/1323220178574938113/SZK83dEL_400x400.jpg`;
//     //const logourl = `https://fineproxy.org/wp-content/uploads/2023/09/Booking.com-logo-2-2048x1152.png`;
//     const logoTitle = `https://lando.stay22.com/hs-fs/hubfs/2560px-Booking.com_logo.svg.png?width=2000&name=2560px-Booking.com_logo.svg.png`;

//     const htmlContent = `<!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Document</title>
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js"></script>
//     <style>
//       body {
//         background-color: #f4f4f4;
//         height: 100vh;
//         padding: 8px;
//         display: flex;
//         flex-direction: column;
//         font-family: Arial, sans-serif;
//       }
//       .Navbar {
//         display: flex;
//         flex-direction: row;
//         background-color: #007bff;
//         height: 70px;
//         padding: 10px;
//         border-radius: 10px 10px 0 0;
//         gap: 25px;
//       }
//       .logo{
//         margin-right:8px;
//       }
//       .logo-title {
//         margin-top: 20px;
//         color: #fff;
//         font-size: 20px;
//         font-weight: bold;
//         align-self: flex-end;
//       }

//       .content {
//         width: 99%;
//         flex-wrap: wrap;
//         height:100% ;
//         margin: 8px;
//       }

//       .greeting {
//         font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
//         max-width: 100%;
//         flex-wrap: wrap;
//       }
//       .booking-details {
//         font-size: 14px;
//       }
//       .addinal-info {
//         max-width: 100%;
//         flex-wrap: wrap;
//         font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
//       }

//       .best-regards {
//         font-size: 12px;
//       }

//       .footer {
//         flex: 1;
//         text-align: center;
//         padding: 10px 0;
//         background-color: #007bff;
//         color: #fff;
//         border-radius: 0 0 10px 10px;
//       }
//     </style>
//   </head>
//   <body>
//   <div id='download'>
//       <div class="Navbar">
//       <img src="${logourl}" alt="logo" height="60px" width="45px" class='logo' />
//        <img src='${logoTitle}' alt='title' height="40px" width="150px" class='logo-title' />
//       </div>
//       <div class="content">
//         <p class="greeting">
//           Dear User ${userDetails.username},<br />
//           Thank you for booking with <a href="'" target="_blank">www.booking.com</a>. We are thrilled to confirm your reservation at -Hotel Name-. Below are the details of your booking:
//         </p>
//         <pre class="booking-details">         
// <b>Booking Details:</b>

// Guest Name: ${userDetails.username}
// Hotel Name: ${hotelDetails.name}
// Check-in Date:  ${userBookingdetails.unavailableDates[0]}
// Check-out Date: ${
//       userBookingdetails.unavailableDates[
//         userBookingdetails.unavailableDates.length - 1
//       ]
//     }
// Room Type: [Room Type]
// Number of Guests: [Number of Guests]
// Booking Reference: [Booking Reference Number]

// <b>Hotel Address:</b>
// ${hotelDetails.name}
// ${hotelDetails.address}
           
// <b>Additional Information:</b>

// Check-in Time:  ${userBookingdetails.unavailableDates[0]} 12:00 AM
// Check-out Time: ${
//       userBookingdetails.unavailableDates[
//         userBookingdetails.unavailableDates.length - 1
//       ]
//     } 11:59 PM
// Hotel Contact Number: 8985836812
// Hotel Email: ${hotelDetails.name}@gmail.com
//         </pre>
//         <p class="additional-info">
//           If you have any questions or need further assistance, please do not
//           hesitate to contact us at bookingsupport@gmail.com or call us
//           at 8985836812. We look forward to
//           welcoming you and ensuring you have a comfortable and enjoyable
//           stay. Thank you for choosing <b>Booking.com</b>.
//         </p>
// <pre>

// <button onclick="downloadPDF()">downloadPDF</button>
// </pre>
//         <p class="best-regards">
//           Best regards,<br />
//           Kishor Guriti,<br />
//           Associate Software Engineer,<br />
//           8985836812.<br />
//           <a href="'">www.booking.com</a>
//         </p>
//       </div>
//       <div class="footer">
//         Visit us at <a href="" target="_blank">www.booking.com</a>
//       </div>
   
//     </div>
//     <script>
//         function downloadPDF() {
//           function downloadPDF() {
//             html2canvas(document.getElementById('download')).then(canvas => {
//                 const imgData = canvas.toDataURL('image/png');
//                 const imgWidth = 210; // A4 size width in mm
//                 const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
//                 const doc = new jsPDF('p', 'mm', 'a4');
//                 let position = 0;
        
//                 doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//                 doc.save('booking_details.pdf');
//             });
//         }
        
//     </script>
//   </body>
// </html>`;

//     var mailOptions = {
//       from: "Rajeshnasina123@gmail.com",
//       to: `${userEmail}`,
//       subject: "Booking Successful",
//       text: "Email functionality checking",
//       html: htmlContent,
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//       } else {
//         //console.log("Email sent: " + info.response);
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

const cancelRoom = async (req, res, next) => {
  console.log('triggered')
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
    console.log('try')
    return res.send({ result: "succuss" });
  } catch (err) {
    console.log('err')
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

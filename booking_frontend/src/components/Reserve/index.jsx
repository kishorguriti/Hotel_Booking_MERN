import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { eachDayOfInterval, format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { DateRange } from "react-date-range";
import ReactLoading from "react-loading";
import ApiMethods from "../../api/methods";

function Reserve({
  handleResvModel,
  daysDiff,
  notificaton,
  imageClicable,
  hotelDetails,
}) {
  const params = useParams();
  const hotelId = params.id;

  const [rooms, setRooms] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCalender, setShowCalender] = useState(false);

  let x = JSON.parse(localStorage.getItem("selectedDate"));
  let loginUser = JSON.parse(localStorage.getItem("loggedUser"));

  let selectedStartDate = x && x[0].startDate;
  let selectedEndDate = x && x[0].endDate;

  let selectedfirstDayOfBooking = format(
    new Date(selectedStartDate),
    "dd/MM/yyyy"
  );

  let selectedlastdateOfBooking = new Date(selectedEndDate);
  selectedlastdateOfBooking = format(selectedlastdateOfBooking, "dd/MM/yyyy");

  

  const [date, setDate] = useState([
    {
      startDate: new Date(selectedStartDate),
      endDate: new Date(selectedEndDate),
      key: "selection",
    },
  ]);

  useEffect(() => {
    selectedStartDate = date[0].startDate;
    selectedEndDate = date[0].endDate;

    let firstDate = new Date(date[0].startDate);
    let endDate = new Date(date[0].endDate);
    let datesArray = [];
    let dates = eachDayOfInterval({ start: firstDate, end: endDate }).map(
      (date) => {
        return datesArray.push(format(date, "dd/MM/yyyy"));
      }
    );

    setBookedDates(datesArray);
    getRooms();
  }, [date]);

  const getRooms = async () => {
    try {
      let res = await ApiMethods.get("rooms", {}, {}, hotelId);
      setRooms(res.data);
      setLoading(false);
    } catch (error) {
      return ''
      
    }
  };

  function roomselected(each, e, roomid) {
    if (e.target.checked) {
      if (!selectedRooms.includes(each)) {
        selectedRooms.push(each);
      }
      return;
    } else {
      if (selectedRooms.includes(each)) {
        let newSelectedRooms = selectedRooms.filter((room) => {
          return room.number !== each.number;
        });
        setSelectedRooms(newSelectedRooms);
      }
    }
  }

  async function updateUserBookings(BookedHotelid, userBookingdetails) {
    let res = await ApiMethods.put(
      "users-update",
      { BookedHotelid, userBookingdetails },
      {},
      loginUser?._id
    );
  }

  const sendEmailToUser = async (userBookingdetails, userDetails, hotelDetails) => {
try{
  let res= await ApiMethods.post('rooms-book-email' ,{ userBookingdetails, userDetails, hotelDetails })

}
catch(error){
  console.log(error)
}







  };

  async function onReserve() {
    setLoading(true);
    let reqData = {
      selectedDates: bookedDates,
      UserselectedRooms: selectedRooms,
    };
    if (selectedRooms.length === 0) {
      notificaton("please select room", "room not selected");
      setTimeout(() => {
        setLoading(false);
      }, 4000);
      return;
    }
    let userBookings;
    selectedRooms.map(async(each, i) => {
      let indroomid = each._id;   
try{
  let res= await ApiMethods.put('rooms-book' ,reqData, {},hotelId , {"roomid":indroomid})
  res=res.data;
  userBookings = { ...res[0][0], hotelId: hotelId };
  if (i === selectedRooms.length - 1) {
    notificaton("Booking Succuss", "succuss");
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }

  sendEmailToUser(userBookings, loginUser, hotelDetails);
  handleResvModel(false);
  updateUserBookings(hotelId, userBookings);
}
catch(error){
  if (i === selectedRooms.length - 1) {
    notificaton("Failed! something went wrong", "fail");
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }
}



    });
  }

  let BookingEndDate;
  function verifyIsAvailable(indRoom) {
    let daysCount = indRoom.unavailableDates.length;
    BookingEndDate = indRoom.unavailableDates[daysCount - 1];
    if (indRoom.unavailableDates.length !== 0) {
      let isInclude = bookedDates.some((each) => {
        return indRoom.unavailableDates.includes(each);
      });
      if (isInclude) {
        return false;
      }
    }
    return true;
  }

  function closingResrvComponent() {
    handleResvModel(false);
    imageClicable(false);
  }

  return (
    <>
      <Container className="reservComponent mt-3">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="close_reserve"
          onClick={closingResrvComponent}
        />
        <Row>
          <Col xs={12} md={6}>
            <p>
              <b>select your rooms:</b>
            </p>
          </Col>
          <Col xs={12} md={6}>
            <label>
              <b>Date</b>
            </label>
            <div className="date_modify">
              <input
                style={{
                  outline: "none",
                  marginTop: "0px",
                  paddingLeft: "10px",
                  fontWeight: "bold",
                  border: "none",
                }}
                className="date_input"
                onClick={() => setShowCalender(!showCalender)}
                onChange={(item) => setDate([item.selection])}
                placeholder={`${format(
                  date[0].startDate,
                  "dd/MM/yyyy"
                )} to ${format(date[0].endDate, "dd/MM/yyyy")}`}
                value={`${format(date[0].startDate, "dd/MM/yyyy")} to ${format(
                  date[0].endDate,
                  "dd/MM/yyyy"
                )}`}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {showCalender && (
               <div className="date_range_modify">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setDate([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={date}
                  minDate={new Date()}
                  style={{ width: "99%" }}
                />
              </div>
            )}
          </Col>
        </Row>
        <Row className="mt-4 rooms_Container">
          {loading && (
            <Col>
              <div className="d-flex flex-column align-items-center">
                <ReactLoading type="bubbles" color="#003580" />
                <p>room data is loading</p>
              </div>
            </Col>
          )}
          {(rooms.length > 0) & !loading ? (
            rooms.map((room, i) => {
              return (
                <>
                  <Col xs={7} className="mt-3">
                    <h6 className="fw-bold mb-1">{room.title}</h6>
                    <p style={{ fontSize: "12px" }} className="m-0">
                      {room.description}
                    </p>
                    <span style={{ fontSize: "10px" }} className="m-0 ">
                      Max People : {room.maxPeople}
                    </span>
                    <p style={{ fontSize: "12px" }}>
                      {/* ₹ <b>{room.price}</b> */}
                    </p>
                  </Col>
                  <Col xs={5} className="mt-3">
                    <Container>
                      <Row>
                        {room.roomNumbers.map((each, index) => {
                          return (
                            <Col
                              className="m-1"
                              xs={2}
                              md={1}
                              key={`${each._id}${index}`}
                            >
                              <div className="checkbox-style">
                                <span
                                  style={{
                                    fontSize: "10px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  {each.number}
                                </span>
                                <FormCheckInput
                                  disabled={!verifyIsAvailable(each)}
                                  onChange={(e) =>
                                    roomselected(each, e, room._id)
                                  }
                                />
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </Container>
                  </Col>
                </>
              );
            })
          ) : (
            <>
              {!loading && (
                <div className="d-flex flex-column align-items-center h-50">
                  <p>No Rooms Available at present!</p>
                </div>
              )}
            </>
          )}
        </Row>
        <Row>
          <Col>
            <div className="btn_container mt-3">
              <Button
                style={{ width: "80%" }}
                onClick={onReserve}
                disabled={loading}
              >
                Reserve Now
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Reserve;

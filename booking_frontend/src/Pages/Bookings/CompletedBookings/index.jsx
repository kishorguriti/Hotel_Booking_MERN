import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./style.css";
import PaginationComponent from "../../../components/Pagination";
import UserFeedBack from "../../../components/UserFeedBack";
import ApiMethods from "../../../api/methods";

function CompletedBookings(props) {
  let loginUser = JSON.parse(localStorage.getItem("loggedUser"));
  const [dataTomap, setDataToMap] = useState([]);
  const [slice, setSlice] = useState([]);
  const [showMoreButton, setShowMoreButton] = useState(true);
  const [ShowAddReviewModel, setShowAddReviewModel] = useState(false);
  const [ShowLoading, setShowLoading] = useState(false);
  const [triggeredReviewHotelObj, settriggeredReviewHotelObj] = useState();
  let loaderType = "spin";
  const navigatesTo = useNavigate();

  useEffect(() => {
    completedBookings();
    setSlice(dataTomap.slice(0, 4));
  }, []);

  const completedBookings = async () => {
    setShowLoading(true);
   
    let result = await ApiMethods.get('users-bookings-completed',{} , {} ,loginUser._id )
    let eachBookingWithHotelInfo = await Promise.all(
      result.data.map(async (each) => {
        
        let BookingDetailsWithHotelInfo = await ApiMethods.get(
          `hotels-find`,{},{},each.hotelId
        );

        const { data } = BookingDetailsWithHotelInfo;
        const { _id, ...otherDetails } = data;
        return { ...otherDetails, ...each };
      })
    );


    setDataToMap(eachBookingWithHotelInfo);
    setSlice(eachBookingWithHotelInfo.slice(0, 4));
    setShowLoading(false);
  };

  let [favloading, setFavLoading] = useState(false);

  const showFullList = () => {
    setSlice(dataTomap);
    setShowMoreButton(false);
  };

  const addTouserFav = (hotelid) => {
  
    setFavLoading(true);
    fetch(`http://localhost:3001/users/updatefav/${loginUser._id}`, {
      method: "put",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({ hotelid }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
      
        setFavLoading(false);
      })
      .catch((err) => {
        
      });
  };

  const changePage = (value) => {
    setSlice(dataTomap.slice(value * 4 - 4, value * 4));
  };

  const navigatesToHotel = (each) => {
    
    navigatesTo(
      `/Booking.com/hotel/${each.name}/${
        each.hotelId
      }?searchresults.en-gb.html=""&city=${each.city.toLowerCase()}&type=${
        each.type
      }`
    );
  };

  const NavigateBookingPage = () => {
    navigatesTo(`/Booking.com`);
  };

  const giveFeedback = (hotel) => {
    setShowAddReviewModel(true);
    settriggeredReviewHotelObj({ ...hotel, userId: loginUser._id });
  };

  return (
    <>
      <Container>
        <Row>
          {slice?.map((eachHotel, i) => {
            return (
              <Col sm={12} lg={6} key={`${eachHotel._id}${i}`}>
                <Card>
                  <div style={{ padding: "20px" }}>
                    <div className="hotel_card_container">
                      <div className="hotel_image_container">
                        <img
                          src={eachHotel?.photos?.length>0 ? eachHotel?.photos[0]:"" }
                          alt="hotelImage"
                          className="hotel_card_img"
                        />

                        {favloading ? (
                          <span className="fav_loader">
                            <ReactLoading
                              type={loaderType}
                              color="#00A400"
                              style={{
                                height: "23px",
                                width: "23px",
                              }}
                            />
                          </span>
                        ) : (
                          <svg
                            onClick={() => addTouserFav(eachHotel.hotelId)}
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
                            fill="currentColor"
                            className="bi bi-heart icon-fav"
                            viewBox="0 0 16 16"
                          >
                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                          </svg>
                        )}
                      </div>
                      <div className="hotel_details_container">
                        <div>
                          <h6
                            style={{
                              color: "#1e4276",
                              maxWidth: "191px",
                              fontSize: "16px",
                            }}
                          >
                            {eachHotel.name}
                          </h6>
                          <p>500m from {eachHotel.landmark} </p>
                        </div>

                        <div className="desc_container">
                          <div className="">
                            <p className="para">
                              Studio Apartment with Air Conditioning
                            </p>
                            <p style={{ fontSize: "14px", maxWidth: "350px" }}>
                              {eachHotel.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="buttons_container">
                      <button
                        className="card_button feedback"
                        onClick={() => giveFeedback(eachHotel)}
                      >
                        feedback
                      </button>
                      <button
                        className="card_button view_details"
                        onClick={() => navigatesToHotel(eachHotel)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
          {(slice.length < 1) & !ShowLoading ? (
            <Col>
              <div className="d-flex flex-column align-items-center">
                <h4>No Completed Bookings </h4>
                <p> Looks like you haven't explored the world yet !</p>
                <span>never is too late , you can start expolre now </span>
                <p>
                  Beautiful world is waiting for you{" "}
                  <span
                    style={{
                      textDecoration: "underline",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    onClick={() => NavigateBookingPage()}
                  >
                    click here
                  </span>{" "}
                  to book now
                </p>
              </div>
            </Col>
          ) : (
            <div> </div>
          )}
        </Row>
      </Container>
      {showMoreButton & (dataTomap.length >= 4) ? (
        <div className="d-flex justify-content-end  m-4">
          <PaginationComponent
            cardCount={dataTomap.length}
            changePage={changePage}
          />
        </div>
      ) : (
        ""
      )}

      {ShowAddReviewModel && (
        <UserFeedBack
          ShowAddReviewModel={ShowAddReviewModel}
          setShowAddReviewModel={setShowAddReviewModel}
          HotelData={triggeredReviewHotelObj}
        />
      )}
    </>
  );
}

export default CompletedBookings;

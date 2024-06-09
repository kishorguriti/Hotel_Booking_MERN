import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./style.css";
import ApiMethods from "../../../api/methods";

function UserFavorites() {
  let loginUser = JSON.parse(localStorage.getItem("loggedUser"));
  const [dataTomap, setDataToMap] = useState([]);
  const [showMoreButton, setShowMoreButton] = useState(true);
  const [loading, setLoading] = useState(true);

  let loaderType = "spin";
  const navigatesTo = useNavigate();

  const showFullList = () => {
    // setSlice(dataTomap);
    setShowMoreButton(false);
  };

  // const removeFav = (hotelid) => {
  //   setFavLoading(true);
  //   fetch(`http://localhost:3001/users/updatefav/${loginUser._id}`, {
  //     method: "put",
  //     headers: {
  //       "content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ hotelid }),
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       setFavLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const navigatesToHotel = (each) => {
    navigatesTo(
      `/Booking.com/hotel/${each.name}/${
        each._id
      }?searchresults.en-gb.html=""&city=${each.city.toLowerCase()}&type=${
        each.type
      }`
    );
  };

  // const NavigateBookingPage = () => {
  //   navigatesTo(`/Booking.com`);
  // };








  const getUserFavHotels = async (favHotelIDsArray) => {
    let userFav = [];
    await Promise.all(
      favHotelIDsArray.map(async (id) => {
        try {
          let res= await ApiMethods.get('hotels-find' , {} ,{} , id)
          let favHoteldetails = await res.json();
          userFav.push(favHoteldetails);
          setLoading(false);
        } catch (err) {
      
        }
      })
    );

    return userFav;
  };


  const getUserInfo= async ()=>{
    try{
      let res = await ApiMethods.get("users", {}, {}, loginUser._id);
      res=res.data
      let favHotels = await getUserFavHotels(res.userFavHotels);
      setDataToMap(favHotels);
    }catch(error){
    return ''
    }
   
  }

  useEffect(() => {
  getUserInfo()
  },[]);

  return (
    <>
      <Container>
        <Row>
          {loading && (
            <Col>
              <div className="loader_container">
                <ReactLoading type={loaderType} color="#003580" />
              </div>
            </Col>
          )}

          {dataTomap.map((eachHotel, i) => {
            return (
              <Col sm={12} lg={6} key={`${eachHotel._id}${i}`}>
                <Card>
                  <div style={{ padding: "20px" }}>
                    <div className="hotel_card_container">
                      <div className="hotel_image_container">
                        <img
                          src={eachHotel.photos[0]}
                          alt="hotelImage"
                          className="hotel_card_img"
                        />

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="19"
                          height="19"
                          fill="currentColor"
                          className="bi bi-heart icon-fav"
                          viewBox="0 0 16 16"
                        >
                          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                        </svg>
                      </div>
                      <div className="hotel_details_container">
                        <div>
                          <h6 style={{ color: "#1e4276", maxWidth: "270px" }}>
                            {eachHotel.name}
                          </h6>
                          <p>500m from {eachHotel.landmark} </p>
                        </div>

                        <div className="desc_container">
                          <div className="">
                            <p className="para">
                              Studio Apartment with Air Conditioning
                            </p>
                            <p
                              className="fav_hotel_desc"
                              style={{ fontSize: "14px", maxWidth: "350px" }}
                            >
                              {eachHotel.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="buttons_container">
                      <button className="card_button feedback">feedback</button>
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
        </Row>
      </Container>
      {showMoreButton & (dataTomap.length >= 4) ? (
        <div className="d-flex justify-content-end w-100 mt-4">
          <Button onClick={showFullList}>
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-right-short"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
              />
            </svg>
          </Button>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default UserFavorites;

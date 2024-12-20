import React, { useEffect, useState } from "react";
import MyNavbar from "../../components/MyNavbar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Login from "../Login";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import Box from "@mui/material/Box";
import { Button, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Reserve from "../../components/Reserve";
import {
  faLocationDot,
  faArrowRight,
  faArrowLeft,
  faCircleXmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactLoading from "react-loading";
import CarouselSlider from "../../components/CarouselSlider";
import { useTranslation } from "react-i18next";
import ApiMethods from "../../api/methods";

function Hotel() {
  const { id, hotelname, hotelId } = useParams();
  const { t, i18n } = useTranslation();

  const [searchParams] = useSearchParams();
  let urlQueryObj = Object.fromEntries([...searchParams]);
  
  let [isImageDisable, setImgDisable] = useState(false);

  const [showImage, setShowImage] = useState(false);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [singleHotel, setSingleHotel] = useState([]);
  const [hotelPhotos, setHotelPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openLoginCom, setOpenLoginCom] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [openResrv, setOpenResrv] = useState(false);
  const [showViewReview, setShowViewReview] = useState(false);

  const navigate = useNavigate();
  let loaderType = "spinningBubbles";
  let x = JSON.parse(localStorage.getItem("selectedDate"));
  let today = new Date();
  let nextDay = new Date(today);
  nextDay.setDate(nextDay.getDate() + 1);

  const selectedStartDate = x ? x[0].startDate : new Date();
  const selectedEndDate = x ? x[0].endDate : nextDay;

  const daysDiff = Math.ceil(
    1 +
      (new Date(selectedEndDate).getTime() -
        new Date(selectedStartDate).getTime()) /
        (24 * 60 * 60 * 1000)
  );

  let priceDetails = useLocation();

  let customerPricePerNight =
    priceDetails?.state?.pricePerNight || urlQueryObj.price;
  let roomsCount = parseInt(
    priceDetails?.state?.people.rooms || urlQueryObj.rooms
  );
  let totalBill = Math.ceil(customerPricePerNight * daysDiff * roomsCount);
  function handleImgIndex(direction) {
    if (direction === "l") {
      setSelectedImgIndex(selectedImgIndex === 0 ? 5 : selectedImgIndex - 1);
    }

    if (direction === "r") {
      setSelectedImgIndex(
        selectedImgIndex === 6 - 1 ? 0 : selectedImgIndex + 1
      );
    }
  }

 
  function handleClickOnImg(i) {
    if (isImageDisable) {
      return;
    }
    setShowImage(true);
    setSelectedImgIndex(i);
  }

  const HotelData = async () => {
    try {
      
 let newData =  await ApiMethods.get('hotels-find', {} , {} , id)
      setSingleHotel(newData.data);
      // console.log(singleHotel ,'setSingleHotel')
      setHotelPhotos(newData.data.photos); // it needs to be changed photos
      setLoading(false);
    } catch (error) {
      
    }
  };

  useEffect(() => {
    HotelData();
  }, []);

  function onBookNow() {
    setImgDisable(true);
    setShowImage(false);

    let loginUser = JSON.parse(localStorage.getItem("loggedUser"));

    if (!loginUser) {
      setOpenLoginCom(true);
      setModalShow(true);
      return;
    }
    setOpenLoginCom(false);
    setModalShow(false);
    setOpenResrv(true);
  }

  const notify = (message, result) => {
    switch (result) {
      case "succuss":
        toast.success(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        break;

      case "fail":
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        break;
      case "room not selected": {
        toast.warn(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Zoom,
        });
        break;
      }

      default:
        toast.success(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
    }
  };

  let date = [
    {
      startDate: new Date(selectedStartDate) || new Date(),
      endDate: new Date(selectedEndDate) || new Date(),
    },
  ];
  let peopleFromUrl = {
    adult: urlQueryObj.adult,
    children: urlQueryObj.children,
    rooms: urlQueryObj.rooms,
  };
  let people = priceDetails?.state?.people || peopleFromUrl;
  let destination = priceDetails?.state?.destination || urlQueryObj.city;

  const goBack = () => {
    if(!destination){
return 
    }
    navigate(
      `/Booking.com/hotels?city=${destination}&&min=${urlQueryObj.min}?&&max=${urlQueryObj.max}?`,
      {
        state: { destination, date, people },
      }
    );
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <MyNavbar />
      <Header type="list" />
      <button
        onClick={() => goBack()}
        className="IconArrow"
        style={{ backgroundColor: "transparent" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-arrow-left"
          viewBox="0 0 16 16"
          style={{ stroke: "blue" }}
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
      </button>

      <div className="hotel_wrapper ">
        <Container className="hotel_details">
          <div>
            <h1 className="hotel_name">{singleHotel.name}</h1>
            <FontAwesomeIcon icon={faLocationDot} />{" "}{" "}
            <span style={{ fontSize: "14px" }}>
              500m {t("from")} {singleHotel.landmark}
            </span>
            <p className="location_Des">
              {/* Excellent location - 5OOm from center */}
            </p>
            <p className="adress_para">
              Book a stay over $114 at this property and get a free airport taxi{" "}
            </p>
          </div>
          <div>
            <button className="book_btn" onClick={onBookNow}>
              {t("Reserve or Book Now!")}
            </button>
          </div>
        </Container>
        {showImage && (
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="left_Arrow"
            onClick={() => handleImgIndex("l")}
          />
        )}
        {showImage && (
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="close_icon"
            onClick={() => setShowImage(false)}
          />
        )}

        <Container className="images_main_container">
          <Row>
            <div
              className={
                showImage
                  ? "images_Container_withgray mt-2"
                  : " images_Container mt-2"
              }
            >
              {loading ? (
                <div className="spinner_container">
                  <ReactLoading type={loaderType} color="#003580" />
                </div>
              ) : (
                hotelPhotos.map((each, index) => {
                  return (
                    <Col xs={4} key={each}>
                      <img
                        style={{ cursor: "pointer" }}
                        className="images_style"
                        key={each}
                        src={each}
                        onClick={() => handleClickOnImg(index)}
                      />
                    </Col>
                  );
                })
              )}
            </div>
          </Row>
        </Container>
        {showImage && (
          <FontAwesomeIcon
            icon={faArrowRight}
            className="right_Arrow"
            onClick={() => handleImgIndex("r")}
          />
        )}
        <Container className="hotel_bottom mb-2 mt-4">
          <Row>
            <Col xs={12} lg={7} xl={9}>
              <div className="hotel_details_desc">
                <h1 className="hotel_title1">Stay in the heart of krakow</h1>
                <p className="hotel_detail_desc">
                  Located a 5-minute walk from St. Florian's Gate in Krakow,
                  Tower Street Apartments has accommodations with air
                  conditioning and free WiFi. The units come with hardwood
                  floors and feature a fully equipped kitchenette with a
                  microwave, a flat-screen TV, and a private bathroom with
                  shower and a hairdryer. A fridge is also offered, as well as
                  an electric tea pot and a coffee machine. Popular points of
                  interest near the apartment include Cloth Hall, Main Market
                  Square and Town Hall Tower. The nearest airport is John Paul
                  II International Kraków–Balice, 16.1 km from Tower Street
                  Apartments, and the property offers a paid airport shuttle
                  service.
                </p>
              </div>
            </Col>

            <Col xs={12} lg={5} xl={3}>
              <div className="hotel_price">
                <h1>Perfect for a {daysDiff} night stay!</h1>
                <span>
                  Located in the real heart of Krakow, this property has an
                  excellent location score of 9.8!
                </span>
                {urlQueryObj.price &&<h4>
                  <b>
                    ₹
                    {daysDiff > 0
                      ?  parseInt(urlQueryObj.price).toLocaleString("en-IN")
                      : customerPricePerNight }
                  </b>{" "}
                  (
                  {daysDiff > 1 ? (
                    <span>
                      {daysDiff} nights-{roomsCount|| 1} rooms
                    </span>
                  ) : (
                    <span>1 night-{roomsCount} rooms</span>
                  )}
                  )
                </h4>}
                <button onClick={onBookNow}>{t("Reserve or Book Now!")}</button>
              </div>
            </Col>
          </Row>
        </Container>
        <Container
          style={{ width: "45vw" }}
          className={showImage ? "image_container " : "d-none"}
        >
          <Row>
            <Col>
              <img
                src={hotelPhotos[selectedImgIndex]}
                className="popup_image"
              />
            </Col>
          </Row>
        </Container>
      </div>
      {openLoginCom ? (
        <Login
          show={modalShow}
          onHide={() => setModalShow(false)}
          notification={notify}
        />
      ) : (
        ""
      )}

      {openResrv && (
        <Reserve
          handleResvModel={setOpenResrv}
          daysDiff={daysDiff}
          notificaton={notify}
          imageClicable={setImgDisable}
          hotelDetails={singleHotel}
        />
      )}
      {singleHotel && singleHotel?.reviews?.length != 0 ? (
        <Container className="p-1">
          <Box sx={{ mt: 1, mb: 1, fontWeight: "bold" }}>
            See what guests loved the most:{" "}
            <span>
              {" "}
              {singleHotel?.reviews && singleHotel?.reviews?.length} reviews
            </span>
          </Box>
          <CarouselSlider CarouselData={singleHotel.reviews} />
        </Container>
      ) : null}

      <Footer />
    </>
  );
}

export default Hotel;

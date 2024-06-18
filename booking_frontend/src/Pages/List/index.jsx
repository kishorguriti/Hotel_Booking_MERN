import React, { useEffect, useRef } from "react";
import Home from "../Home";
import Footer from "../../components/Footer";
import MyNavbar from "../../components/MyNavbar";
import Header from "../../components/Header";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { DateRange } from "react-date-range";
import { useState } from "react";
import { format } from "date-fns";
import "./list.css";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactLoading from "react-loading";
import { useSearchParams } from "react-router-dom";
import CustomGooglMaps from "../../components/GoogleMap";
import NoHotelsFound from "../../components/NoHotelsFound";
import PaginationComponent from "../../components/Pagination";
import PriceRange from "../../components/PriceRange";

import { useTranslation } from "react-i18next";
import ApiMethods from "../../api/methods";

function List() {
  let loaderType = "spin";
  const listRef = useRef();
  const NolistRef = useRef();
  const searchDetails = useLocation();
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  let urlQueryObj = Object.fromEntries([...searchParams]);
  const navigatesTo = useNavigate();
  let today = new Date();
  let nextDay = new Date(today);
  nextDay.setDate(nextDay.getDate() + 1);
  const [showCalender, setShowCalender] = useState(false);
  const [destination, setDestination] = useState(
    searchDetails?.state?.destination
      ? searchDetails.state.destination
      : urlQueryObj.city
  );

  let peopleFromUrl = {
    adult: urlQueryObj?.adult ?? 1,
    children: urlQueryObj?.children ?? 1,
    rooms: urlQueryObj?.rooms ?? 1,
  };

  const [people, setPeople] = useState(
    searchDetails?.state?.people ? searchDetails.state.people : peopleFromUrl
  );

  const [priceRangeArray, SetPriceRangeArray] = useState([1, 100]);
  const [Mydata, setMyData] = useState([]);
  const [slice, setSlice] = useState([]);
  let [favloading, setFavLoading] = useState(false);
  const [hotelFeedBack, setHotelFeedBack] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(
    urlQueryObj?.min ? parseInt(urlQueryObj.min) : 1000
  );
  const [maxPrice, setMaxPrice] = useState(
    urlQueryObj?.max ? parseInt(urlQueryObj.max) : 100000
  );
  const [date, setDate] = useState([
    {
      startDate:
        searchDetails?.state?.date[0].startDate ||
        (urlQueryObj?.from ? new Date(urlQueryObj?.from) : new Date()),
      endDate:
        searchDetails?.state?.date[0].endDate ||
        (urlQueryObj?.to ? new Date(urlQueryObj?.to) : new Date(nextDay)),

      key: "selection",
    },
  ]);

  const daysDiff = Math.ceil(
    1 +
      (new Date(date[0].endDate).getTime() -
        new Date(date[0].startDate).getTime()) /
        (24 * 60 * 60 * 1000)
  );

  localStorage.setItem("selectedDate", JSON.stringify(date));

  const handleChange = (event, newValue) => {
    SetPriceRangeArray(newValue);
    setMinPrice(newValue[0] * 1000);
    setMaxPrice(newValue[1] * 1000);
  };

  function navigatesToHotel(each, price, tax) {
    let bookingBill = Math.ceil(
      parseInt(price.replace(/,/g, "")) + parseInt(tax.replace(/,/g, ""))
    );

    let pricePerNight = each.price || each.cheapestPrice;
    navigatesTo(
      `/Booking.com/hotel/${each.name.replaceAll(" ", "-")}/${
        each._id
      }?searchresults.en-gb.html=""&city=${each.city.toLowerCase()}&type=${
        each.type
      }&adult=${people.adult}&rooms=${
        people.rooms
      }&price=${bookingBill}&min=${minPrice}&max=${maxPrice}&rating=${
        each.rating
      }=?`,
      {
        state: { pricePerNight, people, destination },
      }
    );
  }

  useEffect(() => {
    if (!urlQueryObj.city) {
      getPropertiesBasedOnType();
    } else {
      getAllHotels();
    }
  }, []);

  const getPropertiesBasedOnType = async () => {
    try {
      let hotels = await ApiMethods.get("hotels-type", {
        type: `${urlQueryObj?.type.toLowerCase()}`,
      });
      setMyData(hotels.data);
      setLoading(false);
      setSlice(hotels.data.slice(0, 4));
    } catch (err) {}
  };

  const getAllHotels = async () => {
    try {
      let hotels = await ApiMethods.get("hotels-city", {
        city: `${destination.toLowerCase()}`,
      });
      setMyData(hotels.data);
      setLoading(false);
      setSlice(hotels.data.slice(0, 4));
    } catch (err) {}
  };

  const onSearchClick = async () => {
    setSearchLoading(true);

    navigatesTo(
      `/Booking.com/hotels?searchresults.en-gb.html?&city=${destination?.toLowerCase()}&min=${minPrice}&max=${maxPrice}&daysDiff=${daysDiff}&type=all&adult=${
        people.adult
      }&child=${people.children}&rooms=${people.rooms}&from=${
        date[0].startDate
      }&to=${date[0].endDate}`
    );

    try {
      let hotels = await ApiMethods.get("hotels-city", {
        city: `${destination?.toLowerCase()}`,
        min: `${minPrice}`,
        max: `${maxPrice}`,
        daysDiff: `${daysDiff}`,
      });
      setMyData(hotels.data);
      setLoading(false);
      setSlice(hotels.data.slice(0, 4));
      setSearchLoading(false);
      if (Mydata.length === 0) {
        NolistRef?.current?.scrollIntoView({ behavior: "smooth" });
        NolistRef?.current?.focus();
      } else {
        listRef?.current?.scrollIntoView({ behavior: "smooth" });
        listRef?.current?.focus();
      }
    } catch (err) {}
  };

  const changePage = (value) => {
    setSlice(Mydata.slice(value * 4 - 4, value * 4));
  };

  function changeDate(item) {
    setDate([item.selection]);
    localStorage.removeItem("selectedDate");
  }

  const discountrdPrice = (originalPrice) => {
    let newPrice = Math.ceil((originalPrice * 12) / 100);
    newPrice = Math.ceil(originalPrice - newPrice);
    return newPrice.toLocaleString("en-IN");
  };

  const Tax = (originalPrice) => {
    let discountedPrice = Math.ceil((originalPrice * 12) / 100);
    let taxCalculatedOnPrice = Math.ceil(originalPrice - discountedPrice);
    return ((taxCalculatedOnPrice * 5) / 100).toLocaleString("en-IN");
  };

  const savingAmount = (bill) => {
    return ((parseInt(bill) * 12) / 100).toLocaleString("en-IN");
  };

  const PriceCardTotalBill = (originalBill) => {
    let billAfterDiscount =
      parseInt(originalBill) - (parseInt(originalBill) * 12) / 100;
    let billWithTaxes = billAfterDiscount + (billAfterDiscount * 5) / 100;
    return billWithTaxes.toLocaleString("en-IN");
  };

  return (
    <>
      <MyNavbar />
      <Header type="list" />
      <Container className="mycontainer">
        <Row>
          <Col sm={12} md={4} lg={3}>
            <Row>
              <Col sm={12} className="search_Container mt-4 ml-0 mr-0">
                <h4>{t("Search")}</h4>
                <div>
                  <p style={{ margin: "2px", marginTop: "15px" }}>
                    {t("Destination")}
                  </p>
                  <input
                    style={{
                      outline: "none",
                      width: "99%",
                      paddingLeft: "10px",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                    placeholder={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    value={destination}
                  />
                </div>
                <div>
                  <p style={{ margin: "2px", marginTop: "15px" }}>
                    {t("check-in-Date")}
                  </p>
                  <input
                    style={{
                      outline: "none",
                      marginTop: "0px",
                      paddingLeft: "10px",
                      fontWeight: "bold",
                      width: "99%",
                    }}
                    onClick={() => setShowCalender(!showCalender)}
                    onChange={(item) => changeDate(item)}
                    placeholder={`${format(
                      date[0].startDate,
                      "dd/MM/yyyy"
                    )} to ${format(date[0].endDate, "dd/MM/yyyy")}`}
                    value={`${format(
                      date[0].startDate,
                      "dd/MM/yyyy"
                    )} to ${format(date[0].endDate, "dd/MM/yyyy")}`}
                  />
                </div>
                {showCalender && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => changeDate(item)}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                    minDate={new Date()}
                    style={{ width: "99%" }}
                  />
                )}
                <div className="mt-4">
                  <h6>{t("options")}</h6>
                  <div className="options_Container">
                    {/* <div className="d-flex justify-content-between mt-3">
                      <p className="optionPara">
                        Min Price (per night in 1000)
                      </p>
                      <input
                        type="number"
                        className="option_input"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <p className="optionPara">
                        Max Price (per night in 1000)
                      </p>
                      <input
                        type="number"
                        className="option_input"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div> */}
                    <div className="mt-2">
                      <p className="optionPara">
                        {t("Min-Max Price (per night in ₹ 1000)")}
                      </p>
                      <div className="d-flex justify-content-between">
                        <span>₹ {priceRangeArray[0] * 1000}</span>{" "}
                        <span>₹ {priceRangeArray[1] * 1000}</span>
                      </div>
                      <PriceRange
                        handleChange={handleChange}
                        value={priceRangeArray}
                      />
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <p className="optionPara">{t("Adult")}</p>
                      <input
                        type="number"
                        min={1}
                        className="option_input"
                        placeholder={people.adult}
                        onChange={(e) =>
                          setPeople({ ...people, adult: e.target.value })
                        }
                        value={people.adult}
                      />
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <p className="optionPara">{t("children")}</p>
                      <input
                        className="option_input"
                        placeholder={people.children}
                        onChange={(e) =>
                          setPeople({ ...people, children: e.target.value })
                        }
                        value={people.children}
                      />
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <p className="optionPara">{t("Room")}</p>
                      <input
                        min={1}
                        type="number"
                        className="option_input"
                        placeholder={people.rooms}
                        onChange={(e) =>
                          setPeople({ ...people, rooms: e.target.value })
                        }
                        value={people.rooms}
                      />
                    </div>
                    {/* <div className="mt-2">
                      <p className="optionPara">
                        Min-Max Price (per night in 1000)
                      </p>
                      <div className="d-flex justify-content-between">
                        <span>₹ {priceRangeArray[0] * 1000}</span>{" "}
                        <span>₹ {priceRangeArray[1] * 1000}</span>
                      </div>
                      <PriceRange
                        handleChange={handleChange}
                        value={priceRangeArray}
                      />
                    </div> */}
                  </div>
                </div>
                <div className="mt-5">
                  <button className="input_searchBtn" onClick={onSearchClick}>
                    {!searchLoading ? (
                      <span> {t("Search")}</span>
                    ) : (
                      <span className="mb-3">
                        <ReactLoading
                          type={loaderType}
                          color="white"
                          height="15px"
                          width="15px"
                        />
                      </span>
                    )}
                  </button>
                </div>
              </Col>
              <Col sm={12}>
                <CustomGooglMaps
                  destinationCity={destination}
                  adult={people.adult}
                  children={people.children}
                  rooms={people.rooms}
                />
              </Col>
            </Row>
          </Col>

          {!loading ? (
            <>
              {Mydata.length === 0 ? (
                <Col ref={NolistRef} tabIndex="-1">
                  <NoHotelsFound city={destination} />
                </Col>
              ) : (
                <Col sm={12} md={8} lg={9} ref={listRef} tabIndex="-1">
                  <Container className="list_items">
                    <Row>
                      {slice?.map((eachHotel, i) => {
                        return (
                          <Col sm={12} key={`${eachHotel._id}${i}`}>
                            <Card>
                              <div style={{ padding: "20px" }}>
                                <div className="hotel_card_container">
                                  <div className="hotel_image_container ">
                                    <img
                                      onClick={() =>
                                        navigatesToHotel(
                                          eachHotel,
                                          discountrdPrice(
                                            Math.ceil(
                                              eachHotel.price *
                                                people.adult *
                                                daysDiff
                                            )
                                          ),
                                          Tax(
                                            Math.ceil(
                                              eachHotel.price *
                                                people.adult *
                                                daysDiff
                                            )
                                          )
                                        )
                                      }
                                      src={eachHotel.photos[0]}
                                      alt="hotelImage"
                                      className="hotel_card_img"
                                    />
                                  </div>
                                  <div className="hotel_details_container">
                                    <div className="hotel_name_rating_container">
                                      <div>
                                        <h6 className="hotel_name_style">
                                          {eachHotel.name}
                                          <span className="rating_h">
                                            {" "}
                                            {7}
                                            <svg
                                              style={{ marginTop: "-9px" }}
                                              key={i}
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="10"
                                              height="10"
                                              fill="currentColor"
                                              className="bi bi-star-fill"
                                              color="gold"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <div className="rating_description_card">
                                              <span
                                                style={{ fontSize: "11px" }}
                                              >
                                                {t("onHoverRating")}
                                              </span>
                                            </div>
                                          </span>
                                        </h6>
                                        <p className="land_mark">
                                          500m from {eachHotel.landmark}{" "}
                                        </p>

                                        {/* <div>
                                        <button className="button_style">
                                          Free Airport taxis
                                        </button>
                                      </div> */}
                                      </div>
                                      <div className="rating_word_number">
                                        <div className="fw-bold rating-word">
                                          {eachHotel.rating >= 4
                                            ? "Excellent"
                                            : eachHotel.rating >= 3.5
                                            ? "Good"
                                            : eachHotel.rating <= 3
                                            ? "Average"
                                            : "Bad"}
                                          <p>
                                            {[1, 2, 3, 4, 5].map((value, i) => {
                                              return (
                                                <svg
                                                  style={{ marginTop: "-15px" }}
                                                  key={i}
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="8"
                                                  height="8"
                                                  fill="currentColor"
                                                  className="bi bi-star-fill"
                                                  color={
                                                    value <= eachHotel.rating
                                                      ? "gold"
                                                      : "grey"
                                                  }
                                                  viewBox="0 0 16 16"
                                                >
                                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                </svg>
                                              );
                                            })}
                                          </p>
                                        </div>
                                        <p
                                          style={{
                                            backgroundColor: "#003580",
                                            padding: "3px",
                                            color: "white",
                                            height: "30px",
                                            textAlign: "center",
                                            marginLeft: "10px",
                                          }}
                                        >
                                          {eachHotel.rating.toFixed(1)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="desc_container">
                                      <div className="">
                                        {/* <div>
                                        <button className="button_style">
                                          Free Airport taxis
                                        </button>
                                      </div> */}
                                        <p className="para">
                                          Studio Apartment with Air Conditioning
                                        </p>
                                        <p
                                          className="hotel_description_eclipses"
                                          style={{
                                            fontSize: "14px",
                                            maxWidth: "350px",
                                          }}
                                        >
                                          {eachHotel.description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="cancellation_price_container">
                                      <div className="services">
                                        <p
                                          style={{
                                            color: "#00A400",
                                            fontSize: "10px",
                                            fontWeight: "bold",
                                            marginBottom: "0px",
                                          }}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-check2"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                          </svg>{" "}
                                          {t("Free Cancellation")}
                                        </p>
                                        {/* <span
                                        style={{
                                          fontSize: "12px",
                                        }}
                                      >
                                        You can cancel later,so lock in this
                                        great price today
                                      </span> */}
                                        <p>
                                          <span
                                            style={{
                                              color: "#00A400",
                                              fontSize: "10px",
                                              fontWeight: "bold",
                                              marginBottom: "0px",
                                            }}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-check2"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                            </svg>
                                            {"  "} {t("No prepayment needed")}
                                          </span>

                                          <span style={{ fontSize: "10px" }}>
                                            {" "}
                                            – {t("pay at the property")}
                                          </span>
                                        </p>
                                      </div>
                                      <div className="price_description">
                                        <p>
                                          {daysDiff} {t("night")},{" "}
                                          {people.adult ? people.adult : 1}{" "}
                                          {t("adult")}
                                        </p>
                                        <p className="price_to_show">
                                          <span className="original_Price">
                                            ₹
                                            {eachHotel.price
                                              ? Math.ceil(
                                                  eachHotel.price * daysDiff
                                                ).toLocaleString("en-IN")
                                              : Math.ceil(
                                                  eachHotel.cheapestPrice *
                                                    people.adult *
                                                    daysDiff
                                                ).toLocaleString("en-IN")}
                                          </span>{" "}
                                          <span className="discounted_price">
                                            ₹{" "}
                                            {discountrdPrice(
                                              Math.ceil(
                                                eachHotel.price * daysDiff
                                              )
                                            )}
                                          </span>{" "}
                                          <span className="price_to_show">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="8"
                                              height="8"
                                              fill="currentColor"
                                              className="bi bi-info-circle"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                            </svg>
                                          </span>
                                        </p>
                                        <div className="priceDetails">
                                          <div className="d-flex justify-content-between">
                                            <p>
                                              ₹ {eachHotel.price} x {daysDiff}{" "}
                                              {t("night")}
                                            </p>

                                            <p>
                                              ₹{" "}
                                              {parseInt(
                                                eachHotel.price * daysDiff
                                              ).toLocaleString("en-IN")}
                                            </p>
                                          </div>

                                          <div className="d-flex justify-content-between">
                                            <p>{t("Bonus savings")}</p>
                                            <p>
                                              - ₹{" "}
                                              {savingAmount(
                                                Math.ceil(
                                                  eachHotel.price * daysDiff
                                                )
                                              )}
                                            </p>
                                          </div>
                                          <p className="price_hover_card_description">
                                            {t("whyDiscoutnText")}
                                          </p>
                                          <div className="d-flex justify-content-between">
                                            <p>GST 5%</p>
                                            <p>
                                              + ₹{" "}
                                              {Tax(
                                                Math.ceil(
                                                  eachHotel.price * daysDiff
                                                )
                                              )}
                                            </p>
                                          </div>
                                          {/* <p className="price_hover_card_description">
                                          You’re getting a reduced rate because
                                          you’re a Genius member.
                                        </p> */}
                                          <hr style={{ borderWidth: "2px" }} />
                                          <div className="d-flex justify-content-between">
                                            <p>
                                              <b>{t("Total")}</b>
                                            </p>
                                            <p>
                                              <b>
                                                ₹{" "}
                                                {PriceCardTotalBill(
                                                  eachHotel.price * daysDiff
                                                )}
                                              </b>
                                            </p>
                                          </div>
                                        </div>
                                        <p className="tax-para">
                                          + ₹{" "}
                                          <span className="tax-amount">
                                            {Tax(
                                              Math.ceil(
                                                eachHotel.price * daysDiff
                                              )
                                            )}
                                          </span>{" "}
                                          <span className="tax-text">
                                            {t("taxes and charges")}
                                          </span>
                                        </p>
                                        <div>
                                          <button
                                            className="avail_btn"
                                            onClick={() =>
                                              navigatesToHotel(
                                                eachHotel,
                                                discountrdPrice(
                                                  Math.ceil(
                                                    eachHotel.price *
                                                      people.adult *
                                                      daysDiff
                                                  )
                                                ),
                                                Tax(
                                                  Math.ceil(
                                                    eachHotel.price *
                                                      people.adult *
                                                      daysDiff
                                                  )
                                                )
                                              )
                                            }
                                          >
                                            {t("see availability")}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </Container>
                </Col>
              )}
            </>
          ) : (
            <div className="loader_container">
              <ReactLoading type={loaderType} color="#003580" />
            </div>
          )}
        </Row>
        {!loading & (Mydata.length > 0) ? (
          <div className="d-flex justify-content-end  mt-4 mb-4">
            <PaginationComponent
              cardCount={Mydata.length}
              changePage={changePage}
              min={minPrice}
              max={maxPrice}
            />
          </div>
        ) : (
          ""
        )}
      </Container>
      <Footer />
    </>
  );
}

export default List;

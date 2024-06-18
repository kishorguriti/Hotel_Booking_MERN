import React, { useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import Joyride, { STATUS } from "react-joyride";
import "./header.css";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AvailableCities from "../City_Suggestion";
import notify from "../ToastMessage";

const Header = ({ type }) => {
  const navigatesTo = useNavigate();
  const [destination, setDestination] = useState("vizag");
  const [ShowCalender, setShowCalender] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showTourGuide, setShowTourGuide] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // const [showDateInp, setShowDateInp] = useState(true);
  const [steps, setSteps] = useState([
    {
      content: <h6>welcome to Booking.com</h6>,
      locale: { skip: <strong>SKIP</strong> },
      placement: "center",
      target: "body",
    },
    {
      content: <h6>Enter city</h6>,
      placement: "bottom",
      target: "#city",
      title: "",
    },
    {
      content: <h6>select dates</h6>,
      placement: "bottom",
      target: "#calender",
      title: "",
    },
    {
      content: <h6>select People</h6>,
      placement: "bottom",
      target: "#people",
      title: "",
    },
    {
      content: <h6>click to search</h6>,
      placement: "bottom",
      target: "#search",
      title: "Search",
      locale: { last: "Finish" },
    },
  ]);

  const handleJoyrideCallback = (data) => {
    if (data.action === "reset" && data.status == "ready") {
      localStorage.setItem("isshowTourGuide", true);
      let isshowTourGuide = localStorage.getItem("isshowTourGuide");
      setShowTourGuide(isshowTourGuide);
    }
  };

  const { t } = useTranslation();
  const searchBtnRef = useRef(null);

  useEffect(() => {
    // searchBtnRef?.current?.focus();
    let isshowTourGuide = localStorage.getItem("isshowTourGuide");
    setShowTourGuide(isshowTourGuide);
  }, []);

  let today = new Date();
  let nextDay = new Date(today);
  nextDay.setDate(nextDay.getDate() + 1);

  const [people, setPeople] = useState({
    adult: 1,
    children: 0,
    rooms: 1,
  });

  const [date, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: nextDay || new Date(),

      key: "selection",
    },
  ]);
  // setSelectedDates(date);

  function seeFulldetailsofHotel() {
    if (!destination) {
      searchBtnRef?.current?.focus();
      notify("Enter City", "fail");
      return;
    }

    navigatesTo(
      `/Booking.com/hotels?searchresults.en-gb.html?&city=${destination.toLowerCase()}&type=all&adult=${
        people.adult
      }&child=${people.children}&rooms=${people.rooms}&from=${
        date[0].startDate
      }&to=${date[0].endDate}`,
      {
        state: { destination, people, date },
      }
    );
  }

  const toggleingInpuCal = () => {
    setShowCalender(!ShowCalender);
    setShowOptions(false);
  };
  const toggleOptions = () => {
    setShowCalender(false);
    setShowOptions(!showOptions);
  };

  const navigatesToPage = (name) => {
    navigatesTo(`/Booking.com/${name}`);
  };

  const updateCitySearch = (value) => {
    //document.getElementById("Search_City").style.textTransform:"cap"
    setDestination(value);
    setShowSuggestions(false);
  };

  return (
    <>
      <Container
        className={type !== "list" ? "header" : "header_notList"}
        fluid
      >
        <Container className="d-flex justify-content-between category_scroll">
          <div className="icon-wrapper" onClick={() => navigatesToPage("")}>
            <FontAwesomeIcon icon={faBed} className="icon-style" />
            <span className="icon-name"> {t("Stays")}</span>
          </div>
          <div
            className="icon-wrapper"
            onClick={() => navigatesToPage("flights")}
          >
            <FontAwesomeIcon icon={faPlane} className="icon-style" />
            <span className="icon-name"> {t("Flights")}</span>
          </div>
          <div
            className="icon-wrapper"
            onClick={() => navigatesToPage("car-rentals")}
          >
            <FontAwesomeIcon icon={faCar} className="icon-style" />
            <span className="icon-name"> {t("Car rentals")}</span>
          </div>
          <div
            className="icon-wrapper"
            onClick={() => navigatesToPage("attractions")}
          >
            <FontAwesomeIcon icon={faBed} className="icon-style" />
            <span className="icon-name"> {t("Attractions")}</span>
          </div>
          <div
            className="icon-wrapper"
            onClick={() => navigatesToPage("airport-taxis")}
          >
            <FontAwesomeIcon icon={faTaxi} className="icon-style" />
            <span className="icon-name"> {t("Airport taxis")}</span>
          </div>
        </Container>
        {type !== "list" && (
          <>
            <Container>
              <h3 style={{ color: "white", marginTop: "5px" }}>
                {t("A lifetime of discounts? it's Genius")}
              </h3>
            </Container>
          </>
        )}
        {type !== "list" && (
          <>
            {!showTourGuide && (
              <Joyride
                continuous
                callback={handleJoyrideCallback}
                run={true}
                steps={steps}
                hideCloseButton
                scrollToFirstStep
                spotlightPadding={5}
                showSkipButton
                showProgress
                disableOverlayClose
              />
            )}

            <Container fluid className=" mt-1  d-flex justify-content-center ">
              <div className="input-field-container">
                <div id="city" className="input_align_style" ref={searchBtnRef}>
                  <FontAwesomeIcon icon={faBed} className="input-icon-style" />
                  <input
                    type="search"
                    style={{ textTransform: "capitalize" }}
                    onFocus={() => (
                      setShowSuggestions(true),
                      setShowCalender(false),
                      setShowOptions(false)
                    )}
                    // onBlur={() => setShowSuggestions(false)}
                    className="input-field"
                    placeholder="Where are you going?"
                    onChange={(e) => setDestination(e.target.value)}
                    value={destination.trim()}
                  />
                </div>
                {showSuggestions && (
                  <div className="city_suggestions">
                    <AvailableCities
                      EnteredCity={`${destination.toLowerCase()}`}
                      updateCitySearch={updateCitySearch}
                    />
                  </div>
                )}
                <div id="calender" className="input_align_style">
                  <span htmlFor="calender">
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      className="input-icon-style"
                    />
                  </span>
                  <input
                    className="input-field"
                    readOnly
                    onClick={() => (
                      toggleingInpuCal(), setShowSuggestions(false)
                    )}
                    onChange={(item) => setDateRange([item.selection])}
                    placeholder={`${format(
                      date[0].startDate,
                      "dd/MM/yyy"
                    )} to ${format(date[0].endDate, "dd/MM/yyyy")}`}
                    value={`${format(
                      date[0].startDate,
                      "dd/MM/yyy"
                    )} to ${format(date[0].endDate, "dd/MM/yyyy")}`}
                  />
                </div>
                {ShowCalender && (
                  <DateRange
                    className="datePicker"
                    editableDateInputs={true}
                    onChange={(item) => setDateRange([item.selection])}
                    minDate={new Date()}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                  />
                )}
                <div id="people" className="input_align_style">
                  <FontAwesomeIcon
                    icon={faPerson}
                    className="input-icon-style"
                  />
                  <input
                    onClick={() => (toggleOptions(), setShowSuggestions(false))}
                    readOnly
                    className="input-field"
                    placeholder={`${people.adult} adults . ${people.children}  children . ${people.rooms} rooms`}
                  />
                </div>
                {showOptions && (
                  <div className="SelectingPeople">
                    <div className="optionsItem">
                      <div>Adult</div>
                      <div className="optoonsCountContainer">
                        <button
                          disabled={people.adult <= 1}
                          className="btnStyle"
                          onClick={() =>
                            setPeople({ ...people, adult: people.adult - 1 })
                          }
                        >
                          -
                        </button>
                        <span>{people.adult}</span>
                        <button
                          className="btnStyle"
                          disabled={people.adult >= 9}
                          onClick={() =>
                            setPeople({ ...people, adult: people.adult + 1 })
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionsItem">
                      <div>children</div>
                      <div className="optoonsCountContainer">
                        <button
                          disabled={people.children <= 0}
                          className="btnStyle"
                          onClick={() =>
                            setPeople({
                              ...people,
                              children: people.children - 1,
                            })
                          }
                        >
                          -
                        </button>
                        <span>{people.children}</span>
                        <button
                          className="btnStyle"
                          disabled={people.children >= 9}
                          onClick={() =>
                            setPeople({
                              ...people,
                              children: people.children + 1,
                            })
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionsItem">
                      <div>rooms</div>
                      <div className="optoonsCountContainer">
                        <button
                          className="btnStyle"
                          disabled={people.rooms <= 1}
                          onClick={() =>
                            setPeople({ ...people, rooms: people.rooms - 1 })
                          }
                        >
                          -
                        </button>
                        <span>{people.rooms}</span>
                        <button
                          className="btnStyle"
                          disabled={people.rooms >= 9}
                          onClick={() =>
                            setPeople({ ...people, rooms: people.rooms + 1 })
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div id="search" className="w-100 d-flex">
                  <button
                    className="search-btn"
                    onClick={seeFulldetailsofHotel}
                    // disabled={!destination}
                  >
                    {t("Search")}
                  </button>
                </div>
              </div>
            </Container>
          </>
        )}
      </Container>
    </>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";
import ApiMethods from "../../api/methods";

const Featured = () => {
  const [hotelCountInCityData, setHotelCountInCityData] = useState([]);
  const navigatesTo = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    getCountByCity();
  }, []);

  const getCountByCity = async () => {
    let result = await ApiMethods.get(
      "hotels-countbycity",
       {
        cities: "delhi,hyderabad,vizag",
      }
    );
    setHotelCountInCityData(result.data);
  };

  const getValue = (city) => {
    if (hotelCountInCityData && hotelCountInCityData.length !== 0) {
      let result = hotelCountInCityData?.filter((each) => each.label === city);
      return result && result[0] && result[0].value ? result[0].value : 5;
    }
    return 5;
  };

  const handleCityClick = (city) => {
    navigatesTo(
      `/Booking.com/hotels?searchresults.en-gb.html?&city=${city.toLowerCase()}`
    );
  };

  return (
    <Container>
      <Row>
        <Col sm={12} md={4} onClick={() => handleCityClick("delhi")}>
          <div className="card-style">
            <h1 className="city-name">{t("New Delhi")}</h1>
            <p className="property-style">
              {getValue("delhi")} {t("Properties")}
            </p>
          </div>
        </Col>

        <Col sm={12} md={4} onClick={() => handleCityClick("vizag")}>
          <div className="card-style2">
            <h1 className="city-name">{t("Visakhapatnam")}</h1>
            <p className="property-style">
              {getValue("vizag")} {t("Properties")}
            </p>
          </div>
        </Col>

        <Col sm={12} md={4} onClick={() => handleCityClick("hyderabad")}>
          <div className="card-style3">
            <h1 className="city-name">{t("Hyderabad")}</h1>
            <p className="property-style">
              {getValue("hyderabad")} {t("Properties")}
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Featured;

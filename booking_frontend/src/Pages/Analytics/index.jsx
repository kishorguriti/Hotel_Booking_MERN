import React, { useEffect, useState } from "react";
import "./style.css";
import {  Container, Row, Col } from "react-bootstrap";
import MUIChartsPractice from "../../components/MUIChartsPie";
import MUILineChart from "../../components/MUILineChart";
import Switch from "@mui/material/Switch";
import ApiMethods from "../../api/methods";

const Analytics = () => {
  //const [value, setValue] = useState([1, 100]);
  const [hotelCountInCityData, setHotelCountInCityData] = useState([]);
  const [propertyCountInCity, setPropertyCountInCity] = useState([]);
  const [lineGraphSlectedCity, setLineGraphSelectedCity] = useState([
    "hyderabad",
  ]);
  const [isComparisonEnable, setIsComparisonEnable] = useState(false);

  useEffect(() => {
    getCountByCity();
    getPropertyCountInCity();
  }, [lineGraphSlectedCity, isComparisonEnable]);

  const getCountByCity = async () => {
    let result = await ApiMethods.get(
      "hotels-countbycity",
       {
        cities: "delhi,hyderabad,vizag",
      }
    );
    setHotelCountInCityData(result.data);
  };

  const getPropertyCountInCity = async () => {
   let result = await ApiMethods.get('hotels-OverAllcountbytypeandcity' , {cities :`${lineGraphSlectedCity.join(",")}`}) // passing params here
    setPropertyCountInCity(result.data);
    
  };

  const handleChangeCity = (e, city='') => {
  try{
    if (e.target.checked && isComparisonEnable) {
      setLineGraphSelectedCity([...lineGraphSlectedCity, city]);
    } else if (!e.target.checked && isComparisonEnable) {
      let filteredCities = lineGraphSlectedCity.filter((c) => {
        return c !== city;
      });
      setLineGraphSelectedCity(filteredCities);
    }
  }catch(error){
  
  }
  };

  return (
    <Container>
      <Row>
        <Col sm={12} lg={6}>
          <div>
            <h4 style={{ minWidth: 400 }}> No of properties in each city</h4>
            <MUIChartsPractice data={hotelCountInCityData} />
          </div>
        </Col>
        {propertyCountInCity ? (
          <Col sm={12} lg={6}>
            <div>
              <h4 style={{ minWidth: 400 }}>
                No of different type of properties in city
              </h4>
              <MUILineChart
                LineChartData={propertyCountInCity}
                isComparisonEnable={isComparisonEnable}
                getPropertyCountInCity={getPropertyCountInCity}
              />
            </div>
            {!isComparisonEnable ? (
              <div className="d-flex justify-content-evenly w-75">
                <div className="radio_btn_container">
                  <input
                    type="radio"
                    name="cities"
                    checked={lineGraphSlectedCity.includes("vizag")}
                    onChange={(e) =>
                      e.target.checked && setLineGraphSelectedCity(["vizag"])
                    }
                  />
                  <label className="radio_btn_label">Vizag</label>
                </div>
                <div className="radio_btn_container">
                  <input
                    type="radio"
                    name="cities"
                    checked={lineGraphSlectedCity.includes("hyderabad")}
                    onChange={(e) =>
                      e.target.checked && setLineGraphSelectedCity(["hyderabad"])
                    }
                  />
                  <label className="radio_btn_label">Hyderabad</label>
                </div>
                <div className="radio_btn_container">
                  <input
                    type="radio"
                    name="cities"
                    checked={lineGraphSlectedCity.includes("delhi")}
                    onChange={(e) =>
                      e.target.checked && setLineGraphSelectedCity(["delhi"])
                    }
                  />
                  <label className="radio_btn_label">Delhi</label>
                </div>
              </div>
            ) : null}

            {isComparisonEnable ? (
              <div className="d-flex justify-content-evenly w-75">
                <div className="radio_btn_container">
                  <input
                    type="checkbox"
                    checked={lineGraphSlectedCity.includes("vizag")}
                    onChange={(e) => handleChangeCity(e, "vizag")}
                  />
                  <label className="radio_btn_label">Vizag</label>
                </div>
                <div className="radio_btn_container">
                  <input
                    type="checkbox"
                    checked={lineGraphSlectedCity.includes("hyderabad")}
                    onChange={(e) => handleChangeCity(e, "hyderabad")}
                  />
                  <label className="radio_btn_label">Hyderabad</label>
                </div>
                <div className="radio_btn_container">
                  <input
                    type="checkbox"
                    onChange={(e) => handleChangeCity(e, "delhi")}
                    checked={lineGraphSlectedCity.includes("delhi")}
                  />
                  <label className="radio_btn_label">Delhi</label>
                </div>
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "24px",
              }}
            >
              <span>compare with other_cities</span>
              <Switch
                onChange={(e) => (setIsComparisonEnable(e.target.checked) ,!e.target.checked && setLineGraphSelectedCity(['hyderabad']))}
              />
            </div>
          </Col>
        ) : null}
      </Row>
    </Container>
  );
};

export default Analytics;

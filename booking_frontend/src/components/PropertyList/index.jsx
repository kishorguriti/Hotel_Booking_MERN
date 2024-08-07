import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./style.css";
import MyCustomHook from "../../Hooks/hook";
import { useTranslation } from "react-i18next";
import ApiMethods from "../../api/methods";
import { useNavigate } from "react-router-dom";

function PropertyList() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    getCountByType();
  }, []);

  const getCountByType = async () => {
    let response = await ApiMethods.get("hotels-countbytype");
    setData(response.data);
  };

  const SearchBasedOnPropertyType = (type) => {
    navigation(
      `/Booking.com/hotels/type?searchresults.en-gb.html?&type=${type}`
    );
  };

  return (
    <>
      <Container>
        <Row>
          <Col
            sm={12}
            md={6}
            lg={4}
            onClick={() => SearchBasedOnPropertyType("hotel")}
          >
            <div>
              <img
                src="https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                className="property_img_style"
              />
            </div>
            <div className="d-flex justify-content-between mt-1">
              <h5 className="property-name-style">{t("Hotels")}</h5>
              <p>
                {data.length > 0 ? data[0]?.hotelCount : "0"} {t("Properties")}
              </p>
            </div>
          </Col>
          <Col
            sm={12}
            md={6}
            lg={4}
            onClick={() => SearchBasedOnPropertyType("apartment")}
          >
            <div>
              <img
                src="https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                className="property_img_style"
              />
            </div>
            <div className="d-flex justify-content-between mt-1">
              <h5 className="property-name-style">{t("Apartments")}</h5>
              <p>
                {data.length > 0 ? data[0]?.apartmentCount : "0"}{" "}
                {t("Properties")}
              </p>
            </div>
          </Col>
          <Col
            sm={12}
            md={6}
            lg={4}
            onClick={() => SearchBasedOnPropertyType("resort")}
          >
            <div>
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/222673017.jpg?k=f2634ac5ace7ac2c838528232617ba63b29f08fb27cd8154767a9fb654976ed7&o=&hp=1"
                className="property_img_style"
              />
            </div>
            <div className="d-flex justify-content-between mt-1">
              <h5 className="property-name-style">{t("Resorts")}</h5>
              <p>
                {data.length > 0 ? data[0]?.resortCount : "0"} {t("Properties")}
              </p>
            </div>
          </Col>
          <Col
            sm={12}
            md={6}
            lg={4}
            onClick={() => SearchBasedOnPropertyType("villa")}
          >
            <div>
              <img
                src="https://images.pexels.com/photos/87378/pexels-photo-87378.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                className="property_img_style"
              />
            </div>
            <div className="d-flex justify-content-between mt-1">
              <h5 className="property-name-style">{t("Villas")}</h5>

              <p>
                {data.length > 0 ? data[0]?.villaCount : "0"}{' '}
                {t("Properties")}
              </p>
            </div>
          </Col>
          <Col
            sm={12}
            md={6}
            lg={4}
            onClick={() => SearchBasedOnPropertyType("cabin")}
          >
            <div>
              <img
                src="https://images.pexels.com/photos/206648/pexels-photo-206648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                className="property_img_style"
              />
            </div>
            <div className="d-flex justify-content-between mt-1">
              <h5 className="property-name-style">{t("Cabins")}</h5>
              <p>
                {data.length > 0 ? data[0]?.cabinCount : "0"} {t("Properties")}
              </p>
            </div>
          </Col>
          <Col
            sm={12}
            md={6}
            lg={4}
            onClick={() => SearchBasedOnPropertyType("farmhouse")}
          >
            <div>
              <img
                src="https://blog.newhomesource.com/wp-content/uploads/2019/09/farmhouse.jpg.webp"
                className="property_img_style"
              />
            </div>
            <div className="d-flex justify-content-between mt-1">
              <h5 className="property-name-style">{t("Farmhouse")}</h5>
              <p>
                {data.length > 0 ? data[0]?.FarmHouseCount : "0"} {t("Properties")}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PropertyList;

import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./style.css";

function FeaturedProperty() {
  let images = [
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/2403017/pexels-photo-2403017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/222673017.jpg?k=f2634ac5ace7ac2c838528232617ba63b29f08fb27cd8154767a9fb654976ed7&o=&hp=1",
    "https://images.pexels.com/photos/87378/pexels-photo-87378.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];

  return (
    <Container>
      <Row>
        {[0, 1, 2, 3].map((each, i) => {
          return (
            <Col sm={12} lg={3} md={6} key={i}>
              <div className="featured_property_container">
                <div className="featured_property_img_container">
                  <img
                    src={images[each]}
                    className="featured_property_image"
                    alt="image"
                  />
                </div>
                <div className="featured_property_details_container">
                  <div className="d-flex justify-content-between mt-1">
                    <h5 className="property-name-style">Hilton Garden Inn</h5>
                    <div className="d-flex flex-column align-items-center">
                      <span
                        style={{
                          backgroundColor: "#003580",
                          padding: "2px",
                          color: "white",
                          margin: "2px",
                        }}
                      >
                        8.9
                      </span>
                      {/* <p> Excellent</p> */}
                    </div>
                  </div>
                  <p>Delhi</p>
                  <p>Starting from $120</p>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default FeaturedProperty;

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import MyNavbar from "../../components/MyNavbar";

const UnderProgressComponetn = ({page}) => {
  const Navigation = useNavigate();
 

const getImageOfThePage = (page)=>{
  switch (page) {
    case 'car-rentals':
    return require(`../../assets/carrent.jpg`);
    break;
    case 'flights':
      return require(`../../assets/aircraft.png`);
      break;
    case 'airport-taxis' :
      return require(`../../assets/taxi.png`);
      break;

      case 'attractions':
        return require(`../../assets/attractions.png`);
        break;

      default:
        return require(`../../assets/undraw_Work_in_progress_re_byic.png`);
  }
  
}









  return (
    <>
      <MyNavbar />
      <Header type="list" />
      <Container className="text-center">
        <Row>
          <Col>
            <img
              src={getImageOfThePage(page)}
              height="55%"
              width="100%"
            />
            <span style={{ fontSize: "16px" }}>
              This page is currently under development. We anticipate it will be
              available for service shortly.
            </span>
            <br />
            <span
              style={{
                textDecoration: "underline",
                color: "blue",
                fontSize: "14px",
              }}
              onClick={() => Navigation(-1)}
            >
              Back to previous page
            </span>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UnderProgressComponetn;

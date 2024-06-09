
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UnderProgressComponetn = () => {


const Navigation=useNavigate()

  return (
    <Container className="text-center">
      <Row >
        <Col>
          <img
            src={require(`../../assets/undraw_Work_in_progress_re_byic.png`)}
            height='55%'
            width='100%'
          />
          <span style={{fontSize:"16px"}}>
            This page is currently under development. We anticipate it will be
            available for service shortly.
          </span><br/>
          <span style={{textDecoration:"underline" , color:"blue" , fontSize:"14px"}} onClick={()=>Navigation(-1)}>
            Back to previous page
          </span>
        </Col>
      </Row>
    
    </Container>
  );
};

export default UnderProgressComponetn;

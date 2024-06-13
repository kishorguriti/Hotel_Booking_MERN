import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./style.css";
import { useTranslation } from "react-i18next";
import Login from "../../Pages/Login";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, Zoom, toast } from "react-toastify";
import { Avatar, Tooltip } from "@mui/material";
import { assetsIcons } from "../../common/utility";
import Box from "@mui/material/Box";
import ProfileModel from "../../components/ProfileModel";

function MyNavbar({ type }) {
  const [modalShow, setModalShow] = React.useState(false);
  //const [dummyState, setDummyState] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const { t, i18n } = useTranslation();

  let loginUser = JSON.parse(localStorage.getItem("loggedUser"));

  const navigate = useNavigate();

  const gotoUserpage = (user) => {
    navigate(`/Booking.com/user/${user}/profile`);
  };

  const loggingOut = () => {
    localStorage.removeItem("loggedUser");
    //setDummyState("userloggedout");
    navigate("/Booking.com");
  };

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
          autoClose: 5000,
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

  return (
    <>
      <Navbar
        expand="sm"
        style={{ backgroundColor: "#003580", position: "relative" }}
      >
        <Container>
          <Navbar.Brand
            as={NavLink}
            to="/Booking.com"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Booking.com
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {!loginUser ? (
              <Nav className="ms-auto">
                <Nav.Link
                  className="text-light fw-bold"
                  onClick={() => setModalShow(true)}
                >
                  {t("Login/Register")}
                </Nav.Link>
              </Nav>
            ) : (
              <Nav className="ms-auto">
                <Nav.Link
                  className="text-light ms-auto fw-bold"
                  // style={{ position: "relative" }}
                >
                  <Box
                    onMouseEnter={() => setShowTooltip(true)}
                    // onMouseLeave={() => setShowTooltip(false)}
                    className="user_Profile_NavLink"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      // position: "relative",
                    }}
                  >
                    <Avatar
                      src={
                        loginUser?.profileImage
                          ? loginUser?.profileImage
                          : assetsIcons.user
                      }
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: "100px",
                        marginRight: 1,
                      }}
                    />
                    {loginUser.username}
                  </Box>
                </Nav.Link>

                {showTooltip && (
                  <ProfileModel setShowTooltip={setShowTooltip} />
                )}
                {!type && (
                  <Nav.Link
                    className="text-light ms-auto fw-bold d-md-none"
                    onClick={() => gotoUserpage(loginUser.username)}
                  >
                    Profile
                  </Nav.Link>
                )}
                <Nav.Link
                  className="text-light ms-auto fw-bold d-md-none"
                  onClick={loggingOut}
                >
                  Logout
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
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
      </Navbar>
      {modalShow && (
        <Login
          show={modalShow}
          onHide={() => setModalShow(false)}
          notification={notify}
        />
      )}
    </>
  );
}

export default MyNavbar;

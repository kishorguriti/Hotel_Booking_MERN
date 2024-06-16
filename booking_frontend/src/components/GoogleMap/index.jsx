import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "./style.css";
import { assetsIcons } from "../../common/utility";
import ApiMethods from "../../api/methods";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const markers = [
  // { position: { lat: 17.3616, lng: 78.4747 } },
  // { position: { lat: 17.4506, lng: 78.3812 } },
  { position: { lat: 11.406414, lng: 76.693245 } },
  // { position: { lat: 17.43313031033828, lng: 78.38506532361934 } },
  // { postiton: { lat: 11.406414, lng: 76.693245 } },
];

const CustomGoogleMaps = ({ destinationCity, adult, children, rooms }) => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(destinationCity);
  const [markerIndex, setMarkerIndex] = useState(null);
  const [focusedHotel, setFocusedHotel] = useState([]);
  const navigatesTo = useNavigate();
  useEffect(() => {
    getSingleHotel();
    getHotelsInCity();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Set the location in the state
          setLocation({ latitude, longitude });

          // Fetch the city using a geocoding service (OpenCage in this example)
          const apiKey = "AIzaSyAE524bGGtiXGw_n4Os0ho297JcpZN2cF4";
          const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

          fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results.length > 0) {
                // Extract city from the geocoding response
                const cityResult = data.results[0].components.city;
                setCity(cityResult);
              } else {
                console.error("City not found in geocoding response");
              }
            })
            .catch((error) => console.error("Error fetching city:", error));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
    }
  }, []);

  const getSingleHotel = async () => {
    let id = "64a28e07876f1254391f58dc";
    let hotelinfo = await ApiMethods.get("hotels-find", {}, {}, id);
    let hotelData = await hotelinfo.data;
    setFocusedHotel([hotelData]);
    // return [hotelinfo.data];
    //console.log(focusedHotel, "focusedHotel");
  };

  const getHotelsInCity = async () => {
    let allHotelsInCity = await ApiMethods.get("hotels-city", {
      city: destinationCity,
    });
    console.log(allHotelsInCity.data, "allHotelsInCity google");
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAE524bGGtiXGw_n4Os0ho297JcpZN2cF4",
  });

  const [map, setMap] = React.useState(null);
  const [showWindoInfo, setShowWindoInfo] = useState(false);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();

    markers.forEach((marker) => {
      bounds.extend(marker.position);
    });

    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handelMrkerHover = (value, markerIndexValue) => {
    setMarkerIndex(markerIndexValue);
    setShowWindoInfo(value);
    getSingleHotel();
    // console.log(markerIndexValue, value);
  };

  const handelMrkerClick = () => {
    navigatesTo(
      `/Booking.com/hotel/${focusedHotel[0].name.replaceAll(" ", "-")}/${
        focusedHotel[0]._id
      }?city=${destinationCity}&&adult=${adult}&rooms=${rooms}&&price=${
        focusedHotel[0].price
      }`
    );
  };

  return isLoaded ? (
    <div className="map-container m-1 mt-3">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={containerStyle}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={assetsIcons.map_marker}
            onClick={() => handelMrkerHover(true, index)}
            onDblClick={() => handelMrkerClick()}
            onMouseOver={() => handelMrkerHover(true, index)}
            onMouseOut={() => handelMrkerHover(false, null)}
          >
            {showWindoInfo && markerIndex == index && markerIndex !== null && (
              <InfoWindow
                onCloseClick={() => {
                  setShowWindoInfo(false);
                }}
                style={{ MinWidthDialog: "100%", display: "none" }}
              >
                <Container
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Box>
                    <img
                      src="https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      height={100}
                      width={"100%"}
                    />
                  </Box>
                  <Box
                    className="google-map-hover-boxinfo"
                    style={{
                      margin: "4px",

                      gap: "10px",
                    }}
                  >
                    <p style={{ fontSize: "0.7rem", fontWeight: "bold" }}>
                      {focusedHotel[0]?.name}
                    </p>
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
                      {focusedHotel[0]?.rating.toFixed(1)}
                    </p>
                  </Box>
                </Container>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
};

export default React.memo(CustomGoogleMaps);

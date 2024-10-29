import React, { useEffect, useRef, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { MarkerClusterer } from '@googlemaps/markerclusterer'; // Ensure the right library
import "./style.css";
import { assetsIcons } from "../../common/utility";
import ApiMethods from "../../api/methods";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const CustomGoogleMaps = ({ destinationCity, adult, children, rooms, type }) => {
  const [markerIndex, setMarkerIndex] = useState(null);
  const [focusedHotel, setFocusedHotel] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(null);
  const [showWindoInfo, setShowWindoInfo] = useState(false);
  const [allHotelsInCity, setAllHotelsInCity] = useState([]);
  const navigate = useNavigate();
  const clusterRef = useRef(null);

  useEffect(() => {
    if (type) {
      getPropertiesBasedOnType();
    } else {
      getHotelsInCity();
    }
  }, [type]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAE524bGGtiXGw_n4Os0ho297JcpZN2cF4",
  });

  useEffect(() => {
    if (map && markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => bounds.extend(marker.position));
      map.fitBounds(bounds);
    }
  }, [markers, map]);

 
  useEffect(() => {
    if (!map) return;
    if (!clusterRef.current) {
      clusterRef.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    if (clusterRef.current) {
      clusterRef.current.clearMarkers();
      const markerInstances = markers.map((markerData) => {
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          icon: assetsIcons.map_marker,
        });
  
        
        marker.addListener("click", () => handleMarkerClick(markerData.HotelId));
        marker.addListener('dblclick' ,() => handleMarkerClick(markerData.HotelId))
        marker.addListener("mouseover", () =>
          handleMarkerHover(true, markers.indexOf(markerData), markerData.HotelId)
        );
        marker.addListener("mouseout", () => handleMarkerHover(false, null));
        return marker;
      });

      clusterRef.current.addMarkers(markerInstances);
    }
  }, [markers]);

  const getPropertiesBasedOnType = async () => {
    try {
      let hotels = await ApiMethods.get("hotels-type", { type });
      setAllHotelsInCity(hotels?.data);
      await getMarkers(hotels?.data);
    } catch (err) {
      console.error("Error fetching hotels by type", err);
    }
  };

  const getHotelsInCity = async () => {
    try {
      let allHotelsInCity = await ApiMethods.get("hotels-city", {
        city: destinationCity,
      });
      setAllHotelsInCity(allHotelsInCity.data);
      await getMarkers(allHotelsInCity.data);
    } catch (error) {
      console.error("Error fetching hotels", error);
    }
  };

  const getMarkers = async (data) => {
    try {
      const markersInfo = await Promise.all(
        data.map((each) => ({
          position: each.location,
          HotelId: each._id,
        }))
      );
      setMarkers(markersInfo);
    } catch (error) {
      console.error("Error setting markers", error);
    }
  };

 
  

  const getSingleHotel = async (id) => {
    try {
      const filteredHotel = allHotelsInCity.filter((hotel) => hotel._id === id);
      setFocusedHotel(filteredHotel);
    } catch (error) {
      console.error("Error fetching single hotel", error);
    }
  };

  const handleMarkerHover = (value, markerIndexValue, id) => {
    setMarkerIndex(markerIndexValue);
    setShowWindoInfo(value);
    getSingleHotel(id);
  };

  const handleMarkerClick = () => {
    if (focusedHotel[0]) {
      const hotel = focusedHotel[0];
      navigate(
        `/Booking.com/hotel/${hotel.name.replaceAll(" ", "-")}/${hotel._id}?city=${destinationCity}&adult=${adult}&rooms=${rooms}&price=${hotel.price}`
      );
    }
  };

  return isLoaded ? (
    <div className="map-container m-1 mt-3">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={containerStyle}
        zoom={15}
        onLoad={setMap}
        onUnmount={() => setMap(null)}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={assetsIcons.map_marker}
            // onClick={() => handleMarkerClick(marker.HotelId)}
            // onMouseOver={() => handleMarkerHover(true, index, marker.HotelId)}
            // onMouseOut={() => handleMarkerHover(false, null)}
          >
            {showWindoInfo && markerIndex === index && (
              <InfoWindow onCloseClick={() => setShowWindoInfo(false)}>
                <Container style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Box>
                    <img
                      src={focusedHotel[0]?.photos?.[0] || ""}
                      alt={focusedHotel[0]?.name || ""}
                      height={100}
                      width="100%"
                    />
                  </Box>
                  <Box className="google-map-hover-boxinfo" style={{ margin: "4px", gap: "10px" }}>
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
                      {focusedHotel[0]?.rating?.toFixed(1)}
                    </p>
                  </Box>
                </Container>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  ) : null;
};

export default React.memo(CustomGoogleMaps);

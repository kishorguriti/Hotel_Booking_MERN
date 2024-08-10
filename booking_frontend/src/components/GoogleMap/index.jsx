import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import "./style.css";
import { assetsIcons } from "../../common/utility";
import ApiMethods from "../../api/methods";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// const markers = [
//   // { position: { lat: 17.3616, lng: 78.4747 } },
//   // { position: { lat: 17.4506, lng: 78.3812 } },
//   { position: { lat: 11.406414, lng: 76.693245 } },
//   // { position: { lat: 17.43313031033828, lng: 78.38506532361934 } },
//   // { postiton: { lat: 11.406414, lng: 76.693245 } },
// ];

const CustomGoogleMaps = ({ destinationCity, adult, children, rooms , type }) => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(destinationCity);
  const [markerIndex, setMarkerIndex] = useState(null);
  const [focusedHotel, setFocusedHotel] = useState([]);
  const [markers,setMarkers]=useState([]);
  const [map, setMap] = React.useState(null);
  const [showWindoInfo, setShowWindoInfo] = useState(false);
  const [allHotelsInCity, setAllHotelsInCity]=useState([])
  const navigatesTo = useNavigate();
  useEffect(() => {
    if(type){
      getPropertiesBasedOnType()
    }else{
      getHotelsInCity();
    }
   
  }, []);



  const getPropertiesBasedOnType = async () => {
   
    try {
      let hotels = await ApiMethods.get("hotels-type", {
        type:type ,
      });
      // setMyData(hotels.data);
      // setLoading(false);
      // setSlice(hotels.data.slice(0, 4));
     
      setAllHotelsInCity(hotels?.data);
      await getMarkers(hotels?.data)
    } catch (err) {
      console.log(err.message ,'error')
    }
  };


useEffect(() => {
  if (map && markers.length > 0) {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach((marker) => bounds.extend(marker.position));
    map.fitBounds(bounds);

  //   try {
  //     const googleMarkers = markers.map(markerData => new window.google.maps.Marker({
  //       position: markerData.position,
  //       icon: assetsIcons.map_marker,
  //     }));

  
  //  new  MarkerClusterer({ markers: googleMarkers, map });
  //   } catch (error) {
  //     console.log(error, 'error');
  //   }
   }
}, [markers, map]);

  const getSingleHotel = async (id) => {
try{
 let filterdHotel=allHotelsInCity.filter((hotel)=>{
    return hotel._id == id
   })
    setFocusedHotel(filterdHotel);
}
catch(error){
  console.log(error)
}
  };

  const getHotelsInCity = async () => {
    try{
      let allHotelsInCity = await ApiMethods.get("hotels-city", {
        city: destinationCity,
      });
      setAllHotelsInCity(allHotelsInCity.data);
     await getMarkers(allHotelsInCity.data)
    }
    catch(error){
      return ''
    }
   
  };

const getMarkers = async(data)=>{
try{
let markersInfo= await Promise.all(data.map((each)=>{
  return {position:each.location ,HotelId:each._id }
}))
setMarkers(markersInfo)

}
catch(error){
console.log(error)
}
}

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAE524bGGtiXGw_n4Os0ho297JcpZN2cF4",
  });

 
  const onLoad = React.useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handelMrkerHover = (value, markerIndexValue , id) => {
   

  setMarkerIndex(markerIndexValue);
  setShowWindoInfo(value);
  getSingleHotel(id);
  };

  const handelMrkerClick = () => {
    console.log(focusedHotel ,'click')
 
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
            onClick={() => handelMrkerHover(true, index, marker.HotelId)}
            onDblClick={() => handelMrkerClick()}
            onMouseOver={() => handelMrkerHover(true, index,marker.HotelId)}
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
                  <Box >
                    <img
                      src={focusedHotel[0]?.photos?focusedHotel[0]?.photos[0]:""} 
                      alt= {focusedHotel[0]?.name}
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
  ) : (
    <></>
  );
};

export default React.memo(CustomGoogleMaps);

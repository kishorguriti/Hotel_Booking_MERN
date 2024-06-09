import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import "./style.css";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const markers = [
  { position: { lat: 17.3616, lng: 78.4747 } },
  { position: { lat: 17.4506, lng: 78.3812 } },
  { position: { lat: 17.44273635791334, lng: 78.38164519547365 } },
  { position: { lat: 17.43313031033828, lng: 78.38506532361934 } },
];

const CustomGoogleMaps = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
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

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAE524bGGtiXGw_n4Os0ho297JcpZN2cF4",
  });

  const [map, setMap] = React.useState(null);

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
          <Marker key={index} position={marker.position} />
        ))}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
};

export default React.memo(CustomGoogleMaps);

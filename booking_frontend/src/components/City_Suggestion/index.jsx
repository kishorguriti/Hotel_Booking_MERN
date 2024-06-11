import React, { useEffect, useState } from "react";
import ApiMethods from "../../api/methods";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "react-bootstrap";
import "./style.css";
import { assetsIcons } from "../../common/utility";

const AvailableCities = ({ EnteredCity = "", updateCitySearch = () => {} }) => {
  const [suggestedCities, setSuggestedCities] = useState([]);

  const get_Available_Cities = async () => {
    let cities = await ApiMethods.get("available_cities", {
      city: EnteredCity.trim(),
    });
    setSuggestedCities(cities.data);
  };

  useEffect(() => {
    get_Available_Cities();
  }, [EnteredCity]);

  return (
    <Card
      sx={{ minWidth: 275, borderRadius: "6px" }}
      className="card_container"
    >
      {suggestedCities.length >= 1 ? (
        <CardContent style={{ padding: "0px" }}>
          <p className="popular-suggestions">Popular Destinations nearby</p>

          {suggestedCities?.slice(0, 4).map((each, i) => {
            return (
              <div>
                <Container
                  className="city_container"
                  sx={{
                    marginBottom: "0px",
                    marginTop: "0px",
                  }}
                  onClick={() => updateCitySearch(each)}
                >
                  <img src={assetsIcons.location} height={22} width={20} />
                  <div className="m-2">
                    <p
                      style={{
                        marginBottom: "-10px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {each}
                    </p>
                    <span style={{ fontSize: "11px" }}>
                      Andhra Pradesh ,India
                    </span>
                  </div>
                </Container>
                <hr
                  style={{ width: "120%", margin: "0px -20px" }}
                  className={i + 1 == suggestedCities.length && "d-none"}
                />
              </div>
            );
          })}
        </CardContent>
      ) : (
        <CardContent>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "0px",
            }}
          >
            No Suggestions found
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default AvailableCities;

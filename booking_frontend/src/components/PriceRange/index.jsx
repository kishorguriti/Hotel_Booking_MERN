import React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

export default function RangeSlider(props) {
  return (
    <Box>
      <Slider
        sx={{ color: "#003580", width: "97%" }}
        getAriaLabel={() => "Minimum distance shift"}
        value={props.value}
        onChange={props.handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={props.valuetext}
      />
    </Box>
  );
}

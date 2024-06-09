import * as React from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";

const labels = {
  0.5: "Poor",
  1: "Poor",
  1.5: "Poor",
  2: "Poor",
  2.5: "Average",
  3: "Average",
  3.5: "Good",
  4: "Good",
  4.5: "Excellent",
  5: "Excellent",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

export default function HoverRating({ setUserReview, userReview }) {
  const [value, setValue] = React.useState(3);

  return (
    <Box
      sx={{
        // width: 200,
        display: "flex",
        alignItems: "center",
        marginRight: 4,
      }}
    >
      <Rating
        name="hover-feedback"
        value={value}
        precision={0.5}
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setValue(newValue);
          setUserReview((prev) => ({ ...prev, rating: newValue }));
        }}
       
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />

     
    </Box>
  );
}

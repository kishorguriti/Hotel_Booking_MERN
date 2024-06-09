import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function PaginationComponent({ cardCount, changePage }) {
  
  const [cardCountValue, setCardCountValue] = useState(
    Math.ceil(cardCount / 4)
  );
 
  useEffect(() => {

    setCardCountValue(Math.ceil(cardCount / 4));
    
  }, [cardCount]);

  const handleChange = (e, value) => {
    changePage(value);
    
  };

  return (
    <Stack spacing={2}>
      <Pagination
        count={cardCountValue}
        
        variant="outlined"
        shape="rounded"
        onChange={handleChange}
      />
    </Stack>
  );
}

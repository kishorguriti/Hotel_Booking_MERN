import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";


function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function QuiltedImageList({ hotelData }) {
  

  const itemData = hotelData.photos.map((each, i) => {
    return {
      img: each,
      title: i,
      author: "@arwinneil",
      rows: 1,
      cols: 2,
    };
  });

  return (
    <ImageList
      sx={{ width: 200, height: 150 }}
      variant="quilted"
      cols={4}
      rowHeight={121}
    >
      {itemData.map((item, i) => (
        <ImageListItem
          key={item.img}
          cols={item.cols || 1}
          rows={item.rows || 1}
        >
          <img
            {...srcset(item.img, 121, item.rows, item.cols)}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

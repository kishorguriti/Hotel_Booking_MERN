import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Avatar, Tooltip } from "@mui/material";
import { assetsIcons } from "../../common/utility";
import Link from "@mui/material/Link";
import ViewReview from "../../components/ViewReview";
import { useState } from "react";


import "./style.css";
import ApiMethods from "../../api/methods";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 10000, min: 5000 },
    items: 5,
    slidesToSlide: 5,
  },
  desktop: {
    breakpoint: { max: 5000, min: 1024 },
    items: 3,
    slidesToSlide: 2, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const CarouselSlider = (props) => {
  const { CarouselData = [] } = props;
 
  const [showViewReview, setShowViewReview] = useState(false);
  const [triggeredReview, setTriggeredReview] = useState(null);
  let loginUser = JSON.parse(localStorage.getItem("loggedUser"));

  const getUserProfileImage=async(userId)=>{
   

let response = await ApiMethods.get('users' , {} , { }, userId)
    const {profileImage} = response.data
    return profileImage
  }

  return (
    <>
      <Carousel
        responsive={responsive}
        focusOnSelect={true}
        autoPlay={props.deviceType !== "mobile" ? true : false}
        style={{ marginLeft: "24px", marginRight: "24px" }}
      >
        {CarouselData.map((reviewObj) => {
         
          return (
            <Box
              sx={{
                // height: "25vh",
                border: "1px solid #e7e7e7",
                marginLeft: 1,
                marginRight: 1,
                borderRadius: "2px",
                padding: "12px",
                paddingBottom: "6px",
                //boxShadow: "0 2px 8px 2px rgba(0, 0, 0, 0.16)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar
                    src={
                      reviewObj?.reviewedBy?.profileImage
                        ? reviewObj?.reviewedBy?.profileImage
                        : assetsIcons.user
                       
                    }
                    sx={{ width: 45, height: 45, borderRadius: "100px" }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {reviewObj?.reviewedBy?.username
                        ? reviewObj?.reviewedBy?.username
                        : "User"}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={assetsIcons.indianflag}
                        sx={{ width: 16, height: 16 }}
                      />
                      <Typography>India</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#003580",
                    padding: 1,
                    borderRadius: 1,
                    color: "white",
                    minWidth: 35,
                    textAlign: "center",
                  }}
                >
                  {reviewObj?.rating ? reviewObj?.rating : 2.5}
                </Box>
              </Box>
              <Box
                className="review_comment_text_box"
                sx={{
                  marginTop: "12px",
                  display: "-webkit-box",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "400",
                    fontSize: "14px",
                  }}
                >
                  {" "}
                  {reviewObj.review}
                </Typography>
              </Box>
              <Link
                underline="hover"
                onClick={() => [
                  setShowViewReview((prev) => !prev),
                  setTriggeredReview(reviewObj),
                ]}
              >
                Read more
              </Link>
            </Box>
          );
        })}
      </Carousel>
      {showViewReview ? (
        <ViewReview
          reviewObj={triggeredReview}
          isOpen={true}
          setShowViewReview={setShowViewReview}
        />
      ) : null}
    </>
  );
};

export default CarouselSlider;

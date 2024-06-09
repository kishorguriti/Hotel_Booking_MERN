import React, {  useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import MUIStarRating from "../../components/MUIStarRating";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import EmojiPicker from "emoji-picker-react";
import { assetsIcons } from "../../common/utility";
import { Avatar, Tooltip } from "@mui/material";
import StyledRating from "../../components/StyledRating";
import notify from "../../components/ToastMessage";
import ApiMethods from "../../api/methods";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const previewConfig = {
  showPreview: true,
};
export default function CustomizedDialogs({
  ShowAddReviewModel,
  HotelData,
  setShowAddReviewModel,
}) {
  let loginUser = JSON.parse(localStorage.getItem("loggedUser"));
  const [open, setOpen] = React.useState(ShowAddReviewModel);
  const [reviewtext, setReviewText] = useState("");
  const [showEmojilist, setShowEmojiList] = useState(false);
  const [showImageUpload, setShowImageUplaod] = useState(false);

  const [userReview, setUserReview] = useState({
    title: "",
    rating: 3.5,
    review: "",
    images: [],
    staff: 4,
    service: 3,
  });

  const handleClose = () => {
    setOpen(false);
    setShowAddReviewModel(false);
  };
  const getUserProfileImage = async (userId) => {
    let response = await ApiMethods.get("users", {}, {}, userId);
   
    const { profileImage } = response.data;
   
    return profileImage;
  };

  const handleUploadReviewImgs = () => {};

  const handleSubmitReview = async () => {
    
   
    try {
     
       await ApiMethods.put(
        "hotels-review",
        {
               ...userReview,
               reviewedBy: {
                 username: loginUser?.username,
               userId: loginUser?._id,
                email: loginUser?.email,
                profileImage: await getUserProfileImage(loginUser?._id),
              },
             },
        {},
        HotelData.hotelId
      );
      
      notify("Review Added", "succuss");
      handleClose();
    } catch (error) {
     
    }
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
          }}
          id="customized-dialog-title"
        >
          Review & Rating
          <Tooltip title="rating" arrow bottom>
            <MUIStarRating
              setUserReview={setUserReview}
              userReview={userReview}
            />
          </Tooltip>
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Typography fontWeight="600"> Hotel Name </Typography>
              <Typography> : {HotelData.name}</Typography>
            </Box>
            <Tooltip
              title="click on stars to update rating"
              placement="top"
              arrow
            >
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
                {userReview.rating ? userReview.rating : 0}
              </Box>
            </Tooltip>
          </Box>
          <Box>
            <TextField
              id="outlined-basic"
              label="Review Title"
              variant="outlined"
              sx={{ mt: 3, width: "100%" }}
              onChange={(e) =>
                setUserReview((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              sx={{ mt: 3, width: "100%" }}
              onChange={(e) => [
                [
                  setReviewText(e.target.value),
                  setUserReview((prev) => ({
                    ...prev,
                    review: e.target.value,
                  })),
                ],
              ]}
              onFocus={(e) => [
                setShowEmojiList(false),
                setUserReview((prev) => ({
                  ...prev,
                  review: e.target.value,
                })),
              ]}
              value={userReview.review}
            />
            {/* <textarea rows={5} style={{ width: "100%" }}></textarea> */}
            <Box display="flex" justifyContent="end" alignItems="center">
              <form>
                <input
                  type="file"
                  sx={{ mt: 3 }}
                  onChange={handleUploadReviewImgs}
                  style={{ display: "none" }}
                />
                <Avatar
                  onClick={() => setShowImageUplaod(!showImageUpload)}
                  className="mt-1"
                  src={assetsIcons.uploadImage}
                  sx={{ width: 36, height: 36 }}
                />
              </form>
              <Avatar
                onClick={() => setShowEmojiList(!showEmojilist)}
                className="mt-1"
                src={assetsIcons.emojiLogo}
                sx={{ width: 22, height: 22, marginTop: "24px" }}
              />
            </Box>
            {showImageUpload && <TextField type="file" />}
            {showEmojilist && (
              <Box sx={{ mt: 3, width: "100%" }}>
                <EmojiPicker
                  height={450}
                  width="100%"
                  onEmojiClick={(e) =>
                    setUserReview((prev) => ({
                      ...prev,
                      review: prev.review + e.emoji,
                    }))
                  }
                  previewConfig={previewConfig}
                />
              </Box>
            )}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography>Staff : </Typography>
                <StyledRating
                  defaultSelected={userReview.staff}
                  handelRating={(staffrating) =>
                    setUserReview((prev) => ({
                      ...prev,
                      staff: staffrating,
                    }))
                  }
                />
              </Box>
              <Box>
                <Typography> Sevice:</Typography>
                <StyledRating
                  defaultSelected={userReview.service}
                  handelRating={(serviceRating) =>
                    setUserReview((prev) => ({
                      ...prev,
                      service: serviceRating,
                    }))
                  }
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleSubmitReview()}
            sx={{ color: "#003580" }}
          >
            Submit
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

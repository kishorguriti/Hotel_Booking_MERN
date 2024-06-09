import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Avatar } from "@mui/material";
import { assetsIcons } from "../../common/utility";
import { format } from "date-fns";
import "./style.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({
  reviewObj,
  isOpen,
  setShowViewReview,
}) {
  const [open, setOpen] = React.useState(isOpen);

  const handleClose = () => {
    setOpen(false);
    setShowViewReview(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={"md"}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ maxHeight: 500 }}
      >
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
        <DialogContent
          sx={{ marginTop: 4, display: "flex", gap: 2 }}
          id="review_content_style"
        >
          {/* <DialogContentText id="alert-dialog-slide-description">
            {reviewObj.review}
          </DialogContentText> */}
          <Box sx={{ flex: 1 }}>
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
                <Typography sx={{ fontWeight: 600 }}>
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
          </Box>
          <Box sx={{ flex: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "11px" }}>
                  Reviewed:
                  {reviewObj?.createdAt
                    ? `${format(new Date(reviewObj?.createdAt), "dd-MM-yyyy")} `
                    : null}
                </Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                  {reviewObj?.title
                    ? reviewObj?.title
                    : reviewObj?.rating >= 4.5
                    ? "Absolutely Delightful Stay..."
                    : reviewObj?.rating >= 4
                    ? "Feel home stay❤️"
                    : reviewObj?.rating >= 3.5
                    ? "Average"
                    : reviewObj?.rating < 3
                    ? "Bad"
                    : "ok"}
                </Typography>
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
              sx={{
                marginTop: 2,
                display: "flex",
                flexWrap: "wrap",
                //  maxWidth: "700px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "400",
                  fontSize: "14px",
                  overflow: "overlay",
                }}
              >
                {" "}
                {reviewObj.review}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

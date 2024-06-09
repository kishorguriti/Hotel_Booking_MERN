import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./style.css";

export default function MaxWidthDialog() {
  const [open, setOpen] = React.useState(true);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>T&C</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please ensure that you provide a valid email address so that you can
            receive your booking information promptly. By providing your email
            address, you agree to receive periodic updates about new features,
            special offers, and important information regarding our services.
            Your email address will be kept confidential and will not be shared
            with third parties.
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          ></Box>
        </DialogContent>
        <DialogActions>
          <Button className="mui-text-custom-style" onClick={handleClose}>
            Agree & Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
